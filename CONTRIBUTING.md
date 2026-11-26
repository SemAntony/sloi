# Contributing to @sloi/ui-kit

Это единая точка входа для тех, кто меняет библиотеку. Здесь собрано главное; подробности лежат в документах, на которые есть ссылки. Если документы расходятся, верно то, что проверяет CI.

## Быстрый старт

Нужны Node 24 (версия в `.nvmrc`) и pnpm 10.11.1 (поле `packageManager` в `package.json`, ставится через `corepack enable`).

```bash
pnpm install
pnpm storybook        # витрина компонентов, http://localhost:6006
pnpm test:watch       # unit-тесты в режиме наблюдения
```

## Структура репозитория

| Путь | Что там |
| --- | --- |
| `src/shared/ui/*` | компоненты библиотеки (`primitives/` это обёртки над Radix) |
| `packages/tokens` | дизайн-токены: источник DTCG в `source/`, сборка `pnpm tokens:build` |
| `packages/headless-core` | общая логика без UI (вшивается в бандл) |
| `packages/lit-wrappers` | исследование, не публикуется |
| `visual/` | визуальные регрессии (Playwright), см. `visual/README.md` |
| `consumers/*` | приложения-потребители для проверки интеграции, приватные |
| `docs/` | governance, release, архитектура; карта в `docs/index.md` |

## Ветки и коммиты

- Базовая ветка для работы: `develop`. Стабильные релизы идут из `main` (см. раздел «Версии и релизы» в `README.md`).
- Ветку делайте от `develop`, изменения вливайте через pull request.
- Заголовок коммита: короткий, на английском, в повелительном наклонении, без точки в конце («Fix Combobox clear button centering»).
  Один коммит это одна законченная правка; код, тесты и changeset лежат вместе.

## Перед pull request

Те же проверки запускает CI (`.github/workflows/quality-gate.yml`), поэтому прогоните их локально:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:a11y
pnpm test:stories-a11y     # нужен свежий pnpm storybook:build
pnpm storybook:build
```

Дополнительно, если меняли внешний вид: `pnpm test:visual` (снимки лежат в репозитории; после намеренного изменения дизайна
обновите их `pnpm test:visual:update`, откройте получившиеся PNG и проверьте глазами). Если меняли токены: `pnpm tokens:build`
и `pnpm tokens:contrast`. Если меняли публичные экспорты: `pnpm build` (он же проверяет экспорты скриптом `verify-exports`).

## Новый или изменённый компонент

Обязательный чек-лист: [`docs/governance/component-dod.md`](./docs/governance/component-dod.md). Коротко:

1. API: `forwardRef`, `className`, типы экспортируются из `index.ts`, controlled/uncontrolled по [контракту](./docs/governance/controlled-uncontrolled-contract.md).
2. Доступность: клавиатура, роли и ARIA, видимый фокус, метки у иконок.
3. Стили: только токены (без raw HEX и захардкоженных `ms`/`cubic-bezier`), `*.module.scss`, состояния через `data-*`.
4. Storybook: `Default`, `States`, `Controlled` (если есть), с пометками об ограничениях.
5. Тесты: unit (`*.test.tsx`) и a11y (`*.a11y.test.tsx`).
6. Правила написания обёрток над Radix (`asChild`, SSR, анимации): [`UI_KIT_RULES.md`](./UI_KIT_RULES.md).

Компоненты уровня Tier-1 ([список](./docs/governance/tier-1-components.md)) дополнительно защищены повышенными требованиями:
их API не меняется без RFC ([шаблон](./docs/governance/rfc-template.md)).

## Версии (semver) и changeset

Что считается публичным API и как классифицировать изменение: [`docs/governance/public-api-semver-contract.md`](./docs/governance/public-api-semver-contract.md). Кратко:

| Изменение | Версия |
| --- | --- |
| Исправление, внутренний рефакторинг без изменения поведения | `patch` |
| Новый экспорт, компонент, необязательный проп или токен | `minor` |
| Удаление или переименование экспорта, пропа, колбэка, токена, `className`/`data-*`-хука; смена смысла существующего; смена документированного поведения клавиатуры и фокуса | `major` (нужны RFC и migration notes) |

Если класс неочевиден, считайте изменение `major`, пока не доказано обратное.

Для любого изменения, заметного потребителю (код, стили, токены, типы, поведение): `pnpm changeset`, пакет `@sloi/ui-kit`,
тип изменения и одна-две строки для потребителя; файл `.changeset/*.md` коммитится вместе с кодом.
Для тестов, CI и документации changeset не нужен. Сейчас включён режим предрелиза `rc` (`.changeset/pre.json`).
Сам релиз (версия, тег, публикация): раздел «Версии и релизы» в [`README.md`](./README.md) и [`docs/release/release-checklist.md`](./docs/release/release-checklist.md).

## Документация

Меняете правила, контракты или процесс: правьте соответствующий документ в `docs/governance` и ссылки на него в `docs/index.md`,
а не дублируйте текст в нескольких местах.
