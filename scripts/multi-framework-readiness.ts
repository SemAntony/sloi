import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'node:fs';
import path from 'node:path';

type BundleBudgetEntry = {
  id: string;
  relativePath: string;
  maxBytes: number;
  /**
   * Подпуть-обёртка весит байты, а код лежит в общих чанках `<prefix>-<hash>.<ext>`.
   * Для них бюджет считается по входу вместе с его собственными чанками
   * (общие чанки вроде `popover-*` в бюджет конкретного входа не входят).
   */
  chunkPrefix?: string;
};

type RuntimeStatus = 'planned' | 'in-progress' | 'validated';
type ComponentStability = 'experimental' | 'stable';

type RuntimeParity = {
  status: RuntimeStatus;
  a11yTestPath?: string;
};

type ComponentParityManifestEntry = {
  name: string;
  stability: ComponentStability;
  react: RuntimeParity;
  lit: RuntimeParity;
};

type A11yParityManifest = {
  schemaVersion: string;
  components: ComponentParityManifestEntry[];
};

type ReadinessReport = {
  schemaVersion: string;
  generatedAt: string;
  passed: boolean;
  checks: {
    bundle: {
      passed: boolean;
      entries: Array<{
        id: string;
        relativePath: string;
        sizeBytes: number;
        maxBytes: number;
        passed: boolean;
      }>;
      headlessSourceTotal: {
        relativePath: string;
        sizeBytes: number;
        maxBytes: number;
        passed: boolean;
      };
    };
    tsDx: {
      passed: boolean;
      requiredFiles: Array<{
        relativePath: string;
        exists: boolean;
      }>;
      packageTypeEntries: Array<{
        relativePath: string;
        packageName: string;
        hasTypes: boolean;
      }>;
      smokeCheck: {
        command: string;
        passed: boolean;
        stdout: string;
        stderr: string;
      };
    };
    a11yParity: {
      passed: boolean;
      manifestRelativePath: string;
      stableComponents: number;
      parityValidatedComponents: number;
      components: Array<{
        name: string;
        stability: ComponentStability;
        reactStatus: RuntimeStatus;
        litStatus: RuntimeStatus;
        reactA11yTestExists: boolean;
        litA11yTestExists: boolean;
        stableParitySatisfied: boolean;
        passed: boolean;
      }>;
      warnings: string[];
    };
  };
};

// Бюджеты по каждому входу пакета (docs/architecture/EXPORT-SUBPATHS.md, 2.5), raw-байты, запас около 20%.
// Замер 2026-11-22: index 81 499 / 75 072, date-picker 3 649 / 2 781, data-table-v2 48 105 / 40 023 (esm / cjs).
// Новый подпуть: добавить сюда пару esm/cjs с `chunkPrefix`.
const BUNDLE_BUDGETS: BundleBudgetEntry[] = [
  { id: 'react-esm', relativePath: 'dist/index.js', maxBytes: 100_000 },
  { id: 'react-cjs', relativePath: 'dist/index.cjs', maxBytes: 92_000 },
  { id: 'date-picker-esm', relativePath: 'dist/date-picker.js', maxBytes: 5_000, chunkPrefix: 'date-picker' },
  { id: 'date-picker-cjs', relativePath: 'dist/date-picker.cjs', maxBytes: 4_000, chunkPrefix: 'date-picker' },
  { id: 'data-table-v2-esm', relativePath: 'dist/data-table-v2.js', maxBytes: 60_000, chunkPrefix: 'data-table-v2' },
  { id: 'data-table-v2-cjs', relativePath: 'dist/data-table-v2.cjs', maxBytes: 50_000, chunkPrefix: 'data-table-v2' },
  { id: 'ui-styles', relativePath: 'dist/style.css', maxBytes: 130_000 }
];

const HEADLESS_SOURCE_DIR = 'packages/headless-core/src';
const HEADLESS_SOURCE_MAX_BYTES = 25_000;
const TS_SMOKE_TSCONFIG = 'src/test/fixtures/multi-framework/tsconfig.json';
const A11Y_PARITY_MANIFEST = 'docs/governance/multi-framework-a11y-parity.json';

const REQUIRED_TS_DX_FILES = [
  'src/shared/ui/index.ts',
  'packages/headless-core/src/index.ts',
  'packages/lit-wrappers/src/index.ts',
  'src/test/fixtures/multi-framework/consumer.ts',
  TS_SMOKE_TSCONFIG
] as const;

const TYPES_PACKAGES = [
  {
    packageName: '@sloi/ui-kit',
    relativePath: 'package.json'
  },
  {
    packageName: '@sloi/headless-core',
    relativePath: 'packages/headless-core/package.json'
  },
  {
    packageName: '@sloi/lit-wrappers',
    relativePath: 'packages/lit-wrappers/package.json'
  }
] as const;

type CliArgs = {
  out?: string;
};

const parseJsonFile = <T>(absolutePath: string): T => {
  const source = readFileSync(absolutePath, 'utf8');
  return JSON.parse(source) as T;
};

const resolveFromRoot = (root: string, relativePath: string) => path.resolve(root, relativePath);

const normalizeOutput = (output: string | null) => (output ?? '').trim();

const packageHasTypesEntry = (packageJsonPath: string): boolean => {
  const packageJson = parseJsonFile<Record<string, unknown>>(packageJsonPath);

  const directTypesField = packageJson.types;
  if (typeof directTypesField === 'string' && directTypesField.length > 0) {
    return true;
  }

  const exportsField = packageJson.exports;
  if (typeof exportsField !== 'object' || exportsField === null || Array.isArray(exportsField)) {
    return false;
  }

  const rootExport = (exportsField as Record<string, unknown>)['.'];

  if (typeof rootExport !== 'object' || rootExport === null || Array.isArray(rootExport)) {
    return false;
  }

  const typesEntry = (rootExport as Record<string, unknown>).types;
  return typeof typesEntry === 'string' && typesEntry.length > 0;
};

const calculateHeadlessSourceBytes = (root: string): number => {
  const absoluteDir = resolveFromRoot(root, HEADLESS_SOURCE_DIR);
  const fileNames = readdirSync(absoluteDir);

  return fileNames
    .filter((fileName) => fileName.endsWith('.ts'))
    .reduce((total, fileName) => {
      const absolutePath = path.resolve(absoluteDir, fileName);
      return total + statSync(absolutePath).size;
    }, 0);
};

const runTsSmokeCheck = (root: string) => {
  const commandArgs = ['exec', 'tsc', '--project', TS_SMOKE_TSCONFIG, '--noEmit'];
  const result = spawnSync('pnpm', commandArgs, {
    cwd: root,
    encoding: 'utf8'
  });

  return {
    command: `pnpm ${commandArgs.join(' ')}`,
    passed: result.status === 0,
    stdout: normalizeOutput(result.stdout),
    stderr: normalizeOutput(result.stderr)
  };
};

const measureBundleEntryBytes = (root: string, entry: BundleBudgetEntry): number => {
  const absolutePath = resolveFromRoot(root, entry.relativePath);
  if (!existsSync(absolutePath)) return Number.POSITIVE_INFINITY;

  let total = statSync(absolutePath).size;
  if (entry.chunkPrefix) {
    const directory = path.dirname(absolutePath);
    const extension = path.extname(absolutePath);
    const chunkPattern = new RegExp(`^${entry.chunkPrefix}-[\\w-]+\\${extension}$`);
    for (const name of readdirSync(directory)) {
      if (chunkPattern.test(name)) total += statSync(path.join(directory, name)).size;
    }
  }
  return total;
};

const buildBundleSection = (root: string): ReadinessReport['checks']['bundle'] => {
  const entries = BUNDLE_BUDGETS.map((entry) => {
    const absolutePath = resolveFromRoot(root, entry.relativePath);
    const sizeBytes = measureBundleEntryBytes(root, entry);

    return {
      id: entry.id,
      relativePath: entry.relativePath,
      sizeBytes,
      maxBytes: entry.maxBytes,
      passed: existsSync(absolutePath) && sizeBytes <= entry.maxBytes
    };
  });

  const headlessSourceTotalBytes = calculateHeadlessSourceBytes(root);
  const headlessSourceTotal = {
    relativePath: HEADLESS_SOURCE_DIR,
    sizeBytes: headlessSourceTotalBytes,
    maxBytes: HEADLESS_SOURCE_MAX_BYTES,
    passed: headlessSourceTotalBytes <= HEADLESS_SOURCE_MAX_BYTES
  };

  return {
    passed: entries.every((entry) => entry.passed) && headlessSourceTotal.passed,
    entries,
    headlessSourceTotal
  };
};

const buildTsDxSection = (root: string): ReadinessReport['checks']['tsDx'] => {
  const requiredFiles = REQUIRED_TS_DX_FILES.map((relativePath) => ({
    relativePath,
    exists: existsSync(resolveFromRoot(root, relativePath))
  }));

  const packageTypeEntries = TYPES_PACKAGES.map((entry) => {
    const absolutePath = resolveFromRoot(root, entry.relativePath);
    const hasTypes = existsSync(absolutePath) ? packageHasTypesEntry(absolutePath) : false;

    return {
      relativePath: entry.relativePath,
      packageName: entry.packageName,
      hasTypes
    };
  });

  const smokeCheck = runTsSmokeCheck(root);

  return {
    passed:
      requiredFiles.every((entry) => entry.exists) &&
      packageTypeEntries.every((entry) => entry.hasTypes) &&
      smokeCheck.passed,
    requiredFiles,
    packageTypeEntries,
    smokeCheck
  };
};

const buildA11yParitySection = (root: string): ReadinessReport['checks']['a11yParity'] => {
  const absoluteManifestPath = resolveFromRoot(root, A11Y_PARITY_MANIFEST);
  const manifest = parseJsonFile<A11yParityManifest>(absoluteManifestPath);
  const warnings: string[] = [];

  const components = manifest.components.map((entry) => {
    const reactA11yTestExists = Boolean(
      entry.react.a11yTestPath && existsSync(resolveFromRoot(root, entry.react.a11yTestPath))
    );
    const litA11yTestExists = Boolean(
      entry.lit.a11yTestPath && existsSync(resolveFromRoot(root, entry.lit.a11yTestPath))
    );

    const stableParitySatisfied =
      entry.stability === 'stable'
        ? entry.react.status === 'validated' &&
          entry.lit.status === 'validated' &&
          reactA11yTestExists &&
          litA11yTestExists
        : true;

    const litStatusConsistency = entry.lit.status !== 'validated' || litA11yTestExists;
    const passed = reactA11yTestExists && stableParitySatisfied && litStatusConsistency;

    return {
      name: entry.name,
      stability: entry.stability,
      reactStatus: entry.react.status,
      litStatus: entry.lit.status,
      reactA11yTestExists,
      litA11yTestExists,
      stableParitySatisfied,
      passed
    };
  });

  const stableComponents = components.filter((entry) => entry.stability === 'stable').length;
  const parityValidatedComponents = components.filter(
    (entry) =>
      entry.reactStatus === 'validated' &&
      entry.litStatus === 'validated' &&
      entry.reactA11yTestExists &&
      entry.litA11yTestExists
  ).length;

  if (stableComponents === 0) {
    warnings.push(
      'No stable multi-framework components yet; parity gate remains in experimental readiness mode.'
    );
  }

  return {
    passed: components.every((entry) => entry.passed),
    manifestRelativePath: A11Y_PARITY_MANIFEST,
    stableComponents,
    parityValidatedComponents,
    components,
    warnings
  };
};

export const parseCliArgs = (argv: string[]): CliArgs => {
  const args: CliArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--out') {
      const next = argv[index + 1];
      if (!next || next.startsWith('--')) {
        throw new Error('Expected value after --out');
      }

      args.out = next;
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  return args;
};

export const buildMultiFrameworkReadinessReport = (root: string): ReadinessReport => {
  const bundle = buildBundleSection(root);
  const tsDx = buildTsDxSection(root);
  const a11yParity = buildA11yParitySection(root);
  const passed = bundle.passed && tsDx.passed && a11yParity.passed;

  return {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    passed,
    checks: {
      bundle,
      tsDx,
      a11yParity
    }
  };
};

const summarizeFailure = (report: ReadinessReport): string[] => {
  const messages: string[] = [];

  for (const entry of report.checks.bundle.entries) {
    if (!entry.passed) {
      messages.push(
        `[bundle] ${entry.relativePath} is ${entry.sizeBytes}B and exceeds ${entry.maxBytes}B`
      );
    }
  }

  if (!report.checks.bundle.headlessSourceTotal.passed) {
    messages.push(
      `[bundle] ${report.checks.bundle.headlessSourceTotal.relativePath} total is ${report.checks.bundle.headlessSourceTotal.sizeBytes}B and exceeds ${report.checks.bundle.headlessSourceTotal.maxBytes}B`
    );
  }

  for (const entry of report.checks.tsDx.requiredFiles) {
    if (!entry.exists) {
      messages.push(`[ts-dx] Missing required file: ${entry.relativePath}`);
    }
  }

  for (const entry of report.checks.tsDx.packageTypeEntries) {
    if (!entry.hasTypes) {
      messages.push(`[ts-dx] ${entry.packageName} does not expose a types entry`);
    }
  }

  if (!report.checks.tsDx.smokeCheck.passed) {
    messages.push('[ts-dx] TS smoke check failed');
  }

  for (const entry of report.checks.a11yParity.components) {
    if (!entry.passed) {
      messages.push(`[a11y-parity] ${entry.name} parity contract is not satisfied`);
    }
  }

  return messages;
};

const main = () => {
  const root = process.cwd();
  const args = parseCliArgs(process.argv.slice(2));
  const report = buildMultiFrameworkReadinessReport(root);

  if (args.out) {
    const absoluteOutPath = resolveFromRoot(root, args.out);
    mkdirSync(path.dirname(absoluteOutPath), { recursive: true });
    writeFileSync(absoluteOutPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }

  if (!report.passed) {
    console.error('Multi-framework readiness check failed.');
    for (const message of summarizeFailure(report)) {
      console.error(`- ${message}`);
    }

    process.exit(1);
  }

  console.log(
    `Multi-framework readiness check passed. stable parity: ${report.checks.a11yParity.parityValidatedComponents}/${report.checks.a11yParity.components.length}.`
  );
};

main();
