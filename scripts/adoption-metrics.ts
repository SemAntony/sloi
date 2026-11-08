import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const TOKEN_PATTERN = /--sloi-[a-z0-9-]+/gi
const TOKEN_DECLARATION_PATTERN = /(--sloi-[a-z0-9-]+)\s*:/gi
const TOKEN_USAGE_PATTERN = /var\(\s*(--sloi-[a-z0-9-]+)/gi
const COMPONENT_IMPORT_PATTERN = /import\s+([\s\S]*?)\s+from\s+['"]@sloi\/ui-kit['"]/g

const IGNORED_DIRECTORIES = new Set(['node_modules', '.git', 'dist', 'storybook-static', '.next'])
const CODE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.mdx',
  '.md'
])
const STYLE_EXTENSIONS = new Set(['.css', '.scss', '.sass', '.less'])

type MetricCounter = Record<string, number>

export type UiKitMetrics = {
  components_total: number
  components_with_stories: number
  components_with_tests: number
  components_with_a11y_tests: number
  tokens_total: number
  tokens_used_in_ui: number
}

export type ConsumerMetrics = {
  imports_by_component: MetricCounter
  token_usage_by_name: MetricCounter
  unknown_local_overrides: MetricCounter
}

export type AdoptionReport = {
  schemaVersion: '1.0'
  generatedAt: string
  sources: {
    uiKitRoot: string
    consumers: string[]
  }
  metrics: {
    uiKit: UiKitMetrics
    consumers: ConsumerMetrics
  }
}

export type UiKitAnalysis = {
  metrics: UiKitMetrics
  declaredTokens: string[]
}

export type BuildAdoptionReportOptions = {
  uiKitRoot: string
  consumers?: string[]
  generatedAt?: Date
}

export type CliArguments = {
  out: string
  consumers: string[]
}

function shouldIgnoreDirectory(name: string): boolean {
  return IGNORED_DIRECTORIES.has(name)
}

function isCodeFile(fileName: string): boolean {
  return CODE_EXTENSIONS.has(path.extname(fileName))
}

function isStyleFile(fileName: string): boolean {
  return STYLE_EXTENSIONS.has(path.extname(fileName))
}

function listFilesRecursive(root: string, filter: (fileName: string) => boolean): string[] {
  if (!fs.existsSync(root)) {
    return []
  }

  const stack = [root]
  const files: string[] = []

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) {
      continue
    }

    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (!shouldIgnoreDirectory(entry.name)) {
          stack.push(fullPath)
        }
        continue
      }

      if (filter(entry.name)) {
        files.push(fullPath)
      }
    }
  }

  return files
}

function extractTokenDeclarations(cssContent: string): string[] {
  const tokenSet = new Set<string>()
  for (const match of cssContent.matchAll(TOKEN_DECLARATION_PATTERN)) {
    tokenSet.add(match[1].toLowerCase())
  }
  return [...tokenSet].sort()
}

function increment(counter: MetricCounter, key: string): void {
  counter[key] = (counter[key] ?? 0) + 1
}

function toSortedCounter(counter: MetricCounter): MetricCounter {
  return Object.fromEntries(Object.entries(counter).sort(([left], [right]) => left.localeCompare(right)))
}

function isComponentImplementationFile(fileName: string): boolean {
  if (!/\.(ts|tsx)$/.test(fileName)) {
    return false
  }
  if (fileName === 'index.ts') {
    return false
  }
  return !fileName.includes('.stories.') && !fileName.includes('.test.')
}

function collectComponentDirectories(sharedUiRoot: string): string[] {
  if (!fs.existsSync(sharedUiRoot)) {
    return []
  }

  const stack = [sharedUiRoot]
  const componentDirs: string[] = []

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) {
      continue
    }

    const entries = fs.readdirSync(current, { withFileTypes: true })
    const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name)
    const hasIndexFile = files.includes('index.ts')
    const hasImplementation = files.some(isComponentImplementationFile)

    if (hasIndexFile && hasImplementation) {
      componentDirs.push(current)
    }

    for (const entry of entries) {
      if (entry.isDirectory() && !shouldIgnoreDirectory(entry.name)) {
        stack.push(path.join(current, entry.name))
      }
    }
  }

  return componentDirs.sort()
}

function parseNamedImports(importClause: string): string[] {
  const imports: string[] = []
  const namedMatch = importClause.match(/\{([^}]+)\}/)

  if (namedMatch) {
    const names = namedMatch[1]
      .split(',')
      .map((rawName) => rawName.trim())
      .map((rawName) => rawName.replace(/^type\s+/, ''))
      .map((rawName) => rawName.split(/\s+as\s+/i)[0]?.trim())
      .filter(Boolean) as string[]

    imports.push(...names)
  }

  return imports
}

function parseImportsByComponent(content: string): string[] {
  const importedSymbols: string[] = []
  for (const match of content.matchAll(COMPONENT_IMPORT_PATTERN)) {
    const clause = match[1]?.trim() ?? ''
    if (!clause) {
      continue
    }
    importedSymbols.push(...parseNamedImports(clause))
  }

  return importedSymbols
}

export function analyzeUiKit(uiKitRoot: string): UiKitAnalysis {
  const sharedUiRoot = path.join(uiKitRoot, 'src/shared/ui')
  const tokenDeclarationSources = [
    path.join(uiKitRoot, 'packages/tokens/src/colors.css'),
    path.join(uiKitRoot, 'packages/tokens/src/tokens.css'),
    path.join(uiKitRoot, 'src/app/styles/tokens.css')
  ]
  const componentDirs = collectComponentDirectories(sharedUiRoot)

  let componentsWithStories = 0
  let componentsWithTests = 0
  let componentsWithA11yTests = 0

  for (const componentDir of componentDirs) {
    const entries = fs.readdirSync(componentDir, { withFileTypes: true })
    const fileNames = entries.filter((entry) => entry.isFile()).map((entry) => entry.name)

    if (fileNames.some((fileName) => /\.stories\.(ts|tsx|mdx)$/.test(fileName))) {
      componentsWithStories += 1
    }
    if (fileNames.some((fileName) => /\.test\.(ts|tsx)$/.test(fileName) && !fileName.includes('.a11y.test.'))) {
      componentsWithTests += 1
    }
    if (fileNames.some((fileName) => /\.a11y\.test\.(ts|tsx)$/.test(fileName))) {
      componentsWithA11yTests += 1
    }
  }

  const declaredTokenSet = new Set<string>()
  for (const sourcePath of tokenDeclarationSources) {
    if (!fs.existsSync(sourcePath)) {
      continue
    }

    const content = fs.readFileSync(sourcePath, 'utf8')
    for (const token of extractTokenDeclarations(content)) {
      declaredTokenSet.add(token)
    }
  }
  const declaredTokens = [...declaredTokenSet].sort()
  const knownTokenSet = new Set(declaredTokens)

  const uiFiles = listFilesRecursive(sharedUiRoot, isCodeFile)
  const usedTokenSet = new Set<string>()
  for (const filePath of uiFiles) {
    const content = fs.readFileSync(filePath, 'utf8')
    for (const match of content.matchAll(TOKEN_PATTERN)) {
      const token = match[0].toLowerCase()
      if (knownTokenSet.has(token)) {
        usedTokenSet.add(token)
      }
    }
  }

  return {
    metrics: {
      components_total: componentDirs.length,
      components_with_stories: componentsWithStories,
      components_with_tests: componentsWithTests,
      components_with_a11y_tests: componentsWithA11yTests,
      tokens_total: declaredTokens.length,
      tokens_used_in_ui: usedTokenSet.size
    },
    declaredTokens
  }
}

export function analyzeConsumers(consumers: string[], knownTokens: string[]): ConsumerMetrics {
  const importsByComponent: MetricCounter = {}
  const tokenUsageByName: MetricCounter = {}
  const unknownLocalOverrides: MetricCounter = {}
  const knownTokenSet = new Set(knownTokens.map((token) => token.toLowerCase()))

  for (const consumerRoot of consumers) {
    if (!fs.existsSync(consumerRoot)) {
      throw new Error(`Consumer path does not exist: ${consumerRoot}`)
    }

    const consumerFiles = listFilesRecursive(consumerRoot, isCodeFile)

    for (const filePath of consumerFiles) {
      const content = fs.readFileSync(filePath, 'utf8')

      const importedComponents = parseImportsByComponent(content)
      for (const componentName of importedComponents) {
        increment(importsByComponent, componentName)
      }

      for (const usageMatch of content.matchAll(TOKEN_USAGE_PATTERN)) {
        const token = usageMatch[1].toLowerCase()
        increment(tokenUsageByName, token)
      }

      if (isStyleFile(filePath)) {
        for (const declarationMatch of content.matchAll(TOKEN_DECLARATION_PATTERN)) {
          const token = declarationMatch[1].toLowerCase()
          if (!knownTokenSet.has(token)) {
            increment(unknownLocalOverrides, token)
          }
        }
      }
    }
  }

  return {
    imports_by_component: toSortedCounter(importsByComponent),
    token_usage_by_name: toSortedCounter(tokenUsageByName),
    unknown_local_overrides: toSortedCounter(unknownLocalOverrides)
  }
}

export function buildAdoptionReport(options: BuildAdoptionReportOptions): AdoptionReport {
  const uiKitRoot = path.resolve(options.uiKitRoot)
  const consumers = [...new Set((options.consumers ?? []).map((consumerPath) => path.resolve(consumerPath)))]
  const generatedAt = (options.generatedAt ?? new Date()).toISOString()
  const uiKitAnalysis = analyzeUiKit(uiKitRoot)

  return {
    schemaVersion: '1.0',
    generatedAt,
    sources: {
      uiKitRoot,
      consumers
    },
    metrics: {
      uiKit: uiKitAnalysis.metrics,
      consumers: analyzeConsumers(consumers, uiKitAnalysis.declaredTokens)
    }
  }
}

function getUsageMessage(): string {
  return 'Usage: pnpm run adoption:metrics -- --out <path> [--consumers <path...>]'
}

export function parseCliArgs(args: string[]): CliArguments {
  let outPath: string | undefined
  const consumers: string[] = []

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--') {
      continue
    }

    if (arg === '--out') {
      const value = args[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for --out\n${getUsageMessage()}`)
      }
      outPath = value
      index += 1
      continue
    }

    if (arg === '--consumers') {
      let consumedAtLeastOnePath = false
      while (args[index + 1] && !args[index + 1].startsWith('--')) {
        consumers.push(args[index + 1]!)
        index += 1
        consumedAtLeastOnePath = true
      }
      if (!consumedAtLeastOnePath) {
        throw new Error(`Missing values for --consumers\n${getUsageMessage()}`)
      }
      continue
    }

    throw new Error(`Unknown argument: ${arg}\n${getUsageMessage()}`)
  }

  if (!outPath) {
    throw new Error(`Argument --out is required\n${getUsageMessage()}`)
  }

  return {
    out: outPath,
    consumers
  }
}

export type RunCliResult = {
  outPath: string
  report: AdoptionReport
}

export function runCli(args = process.argv.slice(2), cwd = process.cwd()): RunCliResult {
  const parsedArgs = parseCliArgs(args)
  const outputPath = path.resolve(cwd, parsedArgs.out)
  const consumerPaths = parsedArgs.consumers.map((consumerPath) => path.resolve(cwd, consumerPath))
  const report = buildAdoptionReport({
    uiKitRoot: cwd,
    consumers: consumerPaths
  })

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8')

  return {
    outPath: outputPath,
    report
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = runCli()
    console.info(`Adoption metrics written to ${result.outPath}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
    process.exitCode = 1
  }
}
