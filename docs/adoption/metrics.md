# Adoption Metrics

Метрики adoption считаются локально и сохраняются в JSON-отчёт.

Связанный артефакт Stage B:

- [Adoption feedback loop](./feedback-loop.md)
- [Adoption recipes](./recipes.md)
- [Integration migration notes](./integration-migration-notes.md)

## CLI contract

```bash
pnpm run adoption:metrics -- --out reports/adoption/latest.json --consumers ../app-a ../app-b
```

- `--out` (required): путь к итоговому JSON.
- `--consumers` (optional): список путей до продуктовых репозиториев/папок.

CI-режим без consumers:

```bash
pnpm run adoption:metrics:ci
```

Текущий CI baseline считает метрики по consumers:

- `consumers/sloi-pilot`
- `consumers/sloi-analytics`
- `consumers/sloi-operations` (real consumer track)

## Output schema (stable v1)

```json
{
  "schemaVersion": "1.0",
  "generatedAt": "2026-03-30T00:00:00.000Z",
  "sources": {
    "uiKitRoot": "/abs/path/to/ui-kit",
    "consumers": ["/abs/path/to/app-a"]
  },
  "metrics": {
    "uiKit": {
      "components_total": 0,
      "components_with_stories": 0,
      "components_with_tests": 0,
      "components_with_a11y_tests": 0,
      "tokens_total": 0,
      "tokens_used_in_ui": 0
    },
    "consumers": {
      "imports_by_component": {},
      "token_usage_by_name": {},
      "unknown_local_overrides": {}
    }
  }
}
```

## KPI dictionary

### UI-kit metrics

- `components_total`: число компонентных директорий с `index.ts` и реализацией.
- `components_with_stories`: сколько компонентов имеют story-файлы.
- `components_with_tests`: сколько компонентов имеют unit tests.
- `components_with_a11y_tests`: сколько компонентов имеют `*.a11y.test.*`.
- `tokens_total`: число объявленных токенов в canonical sources `packages/tokens/src/colors.css` + `packages/tokens/src/tokens.css` (fallback: `src/app/styles/tokens.css`).
- `tokens_used_in_ui`: число токенов, реально использованных в `src/shared/ui`.

### Consumer metrics

- `imports_by_component`: сколько раз компонент импортирован из `@sloi/ui-kit`.
- `token_usage_by_name`: частота использования токенов `--sloi-*`.
- `unknown_local_overrides`: локальные объявления `--sloi-*`, которых нет в canonical token sources пакета.

## Initial targets

1. `components_with_stories / components_total >= 0.95`
2. `components_with_tests / components_total >= 0.9`
3. `components_with_a11y_tests / components_total >= 0.75`
4. `unknown_local_overrides` в consumers должен стремиться к `0`.
