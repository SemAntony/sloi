# Multi-Framework Readiness Gate (MF-04)

Документ фиксирует автоматизированный gate для `MF-04`: `bundle size`, `TS DX` и `a11y parity` в staged multi-framework rollout.

Дата baseline: `2026-04-06`.

> **Статус: multi-framework заморожен (исследование, D36).** Lit-обёрток нет, сравнивать parity не с чем (в манифесте все `lit` = `planned`).
> На деле gate проверяет только React-сборку: бюджеты размера бандла (в том числе по входам, см. `docs/architecture/EXPORT-SUBPATHS.md`),
> TypeScript smoke и наличие a11y-тестов у React-компонентов. Команда `pnpm run mf:validate` и CI job `multi-framework-readiness`
> остаются как проверка бюджетов бандла; название историческое.

## 1) Команда запуска

1. `pnpm run mf:validate`

Скрипт:

- собирает `@sloi/ui-kit`;
- проверяет budget по bundle;
- прогоняет TS smoke-check consumer-сценария;
- валидирует a11y parity manifest;
- пишет отчет в `reports/multi-framework/latest.json`.

## 2) Bundle budgets

Budget проверяется для текущего runtime scope:

1. `dist/index.js` (`react-esm`) `<= 300_000 B`
2. `dist/index.cjs` (`react-cjs`) `<= 230_000 B`
3. `dist/style.css` (`ui-styles`) `<= 130_000 B`
4. `packages/headless-core/src` (total source footprint) `<= 25_000 B`

Если хотя бы один порог нарушен, gate падает.

## 3) TS DX checks

Проверки:

1. Наличие ключевых type-entry/source-entry файлов:
   - `src/shared/ui/index.ts`;
   - `packages/headless-core/src/index.ts`;
   - `packages/lit-wrappers/src/index.ts`.
2. Пакеты `@sloi/headless-core` и `@sloi/lit-wrappers` экспонируют `types` entry.
3. TypeScript smoke scenario:
   - [consumer.ts](/Users/sem/WebstormProjects/sloi-ui/src/test/fixtures/multi-framework/consumer.ts)
   - [tsconfig.json](/Users/sem/WebstormProjects/sloi-ui/src/test/fixtures/multi-framework/tsconfig.json)

Smoke-check должен компилироваться без ошибок: это базовый сигнал DX для import surface через package names.

## 4) A11y parity baseline

Parity manifest:

- [multi-framework-a11y-parity.json](./multi-framework-a11y-parity.json)

Правила:

1. Для каждого компонента из target scope должен существовать React `*.a11y.test.*`.
2. Если компонент помечен `stable`, обязательна валидированная parity-пара `React + Lit` (оба статуса `validated` + оба a11y test paths существуют).
3. Пока компонент `experimental`, Lit может оставаться `planned`/`in-progress`, но это не считается parity-ready для GA.

## 5) Артефакты и ownership

1. Скрипт: [multi-framework-readiness.ts](/Users/sem/WebstormProjects/sloi-ui/scripts/multi-framework-readiness.ts)
2. CI job: `.github/workflows/quality-gate.yml` (`multi-framework-readiness`)
3. Отчет: [reports/multi-framework/latest.json](/Users/sem/WebstormProjects/sloi-ui/reports/multi-framework/latest.json)
4. Связанный contract: [public-api-semver-contract.md](./public-api-semver-contract.md)
