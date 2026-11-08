import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { analyzeConsumers, analyzeUiKit, buildAdoptionReport, parseCliArgs } from '../../scripts/adoption-metrics'

const testDir = path.dirname(fileURLToPath(import.meta.url))
const fixturesRoot = path.resolve(testDir, 'fixtures/adoption')
const fixtureUiKitRoot = path.resolve(fixturesRoot, 'ui-kit')
const fixtureConsumerRoot = path.resolve(fixturesRoot, 'consumer-a')

describe('adoption metrics script', () => {
  it('counts ui-kit metrics from fixture', () => {
    const uiKitAnalysis = analyzeUiKit(fixtureUiKitRoot)

    expect(uiKitAnalysis.metrics).toEqual({
      components_total: 2,
      components_with_stories: 1,
      components_with_tests: 1,
      components_with_a11y_tests: 1,
      tokens_total: 3,
      tokens_used_in_ui: 2
    })
  })

  it('counts consumer imports, token usage and unknown overrides', () => {
    const uiKitAnalysis = analyzeUiKit(fixtureUiKitRoot)
    const consumerMetrics = analyzeConsumers([fixtureConsumerRoot], uiKitAnalysis.declaredTokens)

    expect(consumerMetrics).toEqual({
      imports_by_component: {
        Button: 1,
        Input: 1
      },
      token_usage_by_name: {
        '--sloi-color-border': 1,
        '--sloi-color-primary': 1
      },
      unknown_local_overrides: {
        '--sloi-color-brand': 1
      }
    })
  })

  it('keeps a stable report contract shape', () => {
    const report = buildAdoptionReport({
      uiKitRoot: fixtureUiKitRoot,
      consumers: [fixtureConsumerRoot],
      generatedAt: new Date('2026-03-30T00:00:00.000Z')
    })

    const normalizedReport = {
      ...report,
      generatedAt: '<ISO_DATE>',
      sources: {
        uiKitRoot: '<UI_KIT_ROOT>',
        consumers: ['<CONSUMER_ROOT>']
      }
    }

    expect(normalizedReport).toMatchInlineSnapshot(`
      {
        "generatedAt": "<ISO_DATE>",
        "metrics": {
          "consumers": {
            "imports_by_component": {
              "Button": 1,
              "Input": 1,
            },
            "token_usage_by_name": {
              "--sloi-color-border": 1,
              "--sloi-color-primary": 1,
            },
            "unknown_local_overrides": {
              "--sloi-color-brand": 1,
            },
          },
          "uiKit": {
            "components_total": 2,
            "components_with_a11y_tests": 1,
            "components_with_stories": 1,
            "components_with_tests": 1,
            "tokens_total": 3,
            "tokens_used_in_ui": 2,
          },
        },
        "schemaVersion": "1.0",
        "sources": {
          "consumers": [
            "<CONSUMER_ROOT>",
          ],
          "uiKitRoot": "<UI_KIT_ROOT>",
        },
      }
    `)
  })

  it('parses CLI args with required out and optional consumers', () => {
    const parsed = parseCliArgs(['--out', 'reports/adoption/latest.json', '--consumers', '../app-a', '../app-b'])
    expect(parsed).toEqual({
      out: 'reports/adoption/latest.json',
      consumers: ['../app-a', '../app-b']
    })
  })
})
