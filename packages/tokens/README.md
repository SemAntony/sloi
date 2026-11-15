# @sloi/tokens

Public design tokens package for Sloi UI. Источник истины: DTCG-файлы в `source/`; всё в `src/` кроме `styles.css` и `typography.css` генерируется.

## Exports

- `@sloi/tokens/css/styles.css`
- `@sloi/tokens/css/palette.css`
- `@sloi/tokens/css/colors.css`
- `@sloi/tokens/css/tokens.css`
- `@sloi/tokens/css/typography.css`
- `@sloi/tokens/tokens.json`: DTCG, палитра + foundation + light (алиасы `{path.to.token}` сохранены)
- `@sloi/tokens/tokens.dark.json`: DTCG, только переопределения тёмной темы
- `@sloi/tokens`: `TOKENS`, `DARK_TOKENS`, `TOKEN_SCHEMA_URL` (объекты из JSON выше, типы в `tokens.d.ts`)

## Как менять токены

1. Правьте файл в `source/` (не `src/`):
   - `primitives/palette.json`: `palette.<hue>.<step>`
   - `foundation.json`: `space`, `radius`, `size`, `font`, `motion`
   - `semantic/light.json` и `semantic/dark.json` (в dark только переопределения)
2. `pnpm tokens:build` (из корня) пересобирает `src/*.css|json|js|d.ts`.
3. `pnpm test` падает, если `src/` не совпадает со сборкой из `source/`; `pnpm tokens:contrast` проверяет контраст.

### Соглашения

- Имя CSS-переменной = `--sloi-` + путь токена через дефис: `font.size.200` → `--sloi-font-size-200`. Правила путей для новых токенов задаёт `pathFor` в `scripts/migrate-css-to-dtcg.mjs`.
- Цвета: hex-строки. Алиасы: `{palette.slate.11}`. Тёмная тема ссылается на токены той же темы.
- `color-mix` и ключевые слова `ease*` не выражаются в DTCG. У таких токенов `$value` хранит эквивалент (hex с альфой, `cubicBezier`), а точная CSS-строка лежит в `$extensions["sloi.css"]` и попадает в CSS без изменений.

Не называйте токен и группу одним именем (`field.border` и `field.border.hover`): DTCG этого не допускает. Поэтому составные хвосты пишутся через дефис: `field.border-hover`.
