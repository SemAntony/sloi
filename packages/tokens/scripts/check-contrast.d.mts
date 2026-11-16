export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}
export interface CheckResult {
  theme: string;
  fg: string;
  bg: string;
  min: number;
  level: string;
  ratio?: number;
  error?: string;
  status: 'pass' | 'fail' | 'known' | 'advisory' | 'error';
}
export interface Outcome {
  results: CheckResult[];
  stale: unknown[];
  uncovered: string[];
}
export function resolveColor(value: string, vars: Record<string, string>): Rgba;
export function contrastRatio(foreground: Rgba, background: Rgba): number;
export function buildThemes(paletteCss: string, colorsCss: string): Record<string, Record<string, string>>;
export function runChecks(themes: Record<string, Record<string, string>>, config: unknown): Outcome;
export function loadAndRun(configPath?: string): Outcome;
export function hasFailures(outcome: Outcome): boolean;
export function formatReport(outcome: Outcome, options?: { showAll?: boolean }): string;
export function parseThemeBlocks(css: string): Record<string, Record<string, string>>;
export function parseDeclarations(css: string): Record<string, string>;
