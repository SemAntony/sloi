# Color Foundations Module

Документ формализует color foundation как самостоятельный модуль в `@sloi/tokens`.

## 1) Canonical file map

1. Primitive palette: `packages/tokens/src/palette.css`.
2. Semantic colors (light + dark): `packages/tokens/src/colors.css`.
3. Non-color global tokens: `packages/tokens/src/tokens.css`.
4. Public aggregate entrypoint: `packages/tokens/src/styles.css`.

## 2) Layering contract

1. `primitive -> semantic -> component usage`.
2. Компоненты в `src/shared/ui/*` используют только semantic tokens.
3. Прямое использование `--sloi-palette-*` в компонентах запрещено.
4. Raw HEX в компонентных стилях запрещен.

## 3) Semantic color domains

1. Surface: `--sloi-surface-*`.
2. Text: `--sloi-text-*`.
3. Border/focus: `--sloi-border-*`, `--sloi-focus-ring`.
4. Interactive roles: `--sloi-interactive-*`.
5. Field roles: `--sloi-field-*`.
6. Status roles: `--sloi-status-{info|success|warning|danger}-*`.
7. Accent/backdrop/floating: `--sloi-accent-*`, `--sloi-overlay-*`, `--sloi-shadow-*`.

## 4) Dark theme contract

1. Dark overrides живут только в `packages/tokens/src/colors.css` внутри `[data-theme='dark']`.
2. Если semantic token относится к color-domain, он обязан иметь light mapping и при необходимости dark override.
3. Нельзя добавлять dark overrides в компонентных стилях.

## 5) Change policy

1. Любой новый semantic color token требует use-case и обновления governance policy.
2. Любое изменение primitive palette family/scale требует RFC.
3. После изменений обязательно выполнить:
   - `pnpm run tokens:sync`
   - `pnpm run adoption:metrics:ci`
   - quality gates (`typecheck`, `lint`, `test`, `test:a11y`, `storybook:build`).

## 6) Baseline targets

1. Semantic color tokens: целевой диапазон `45-70`.
2. Unknown consumer overrides: `0`.
3. `tokens_used_in_ui / tokens_total >= 0.75`.
