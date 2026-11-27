# Design System Execution Plan (Single Source of Truth)

Контекст: `@sloi/ui-kit` движется от strong core к зрелой продуктовой design system без хаотичного расширения surface area.

Дата baseline: `2026-04-06`.

Связанные документы:

1. [Maturity definition](../governance/maturity-definition.md)
2. [Tier-1 components](../governance/tier-1-components.md)
3. [Styling contract](../governance/styling-contract.md)
4. [Color foundations module](../governance/color-foundations.md)
5. [Typography/Spacing/Motion foundations module](../governance/typography-spacing-motion-foundations.md)
6. [Iconography and color token policy](../governance/iconography-color-token-policy.md)
7. [Icon use-case evidence registry](../governance/icon-use-case-evidence.md)
8. [Icon accessibility contract](../governance/icon-a11y-contract.md)
9. [Adoption metrics](../adoption/metrics.md)
10. [Adoption feedback loop](../adoption/feedback-loop.md)
11. [Adoption recipes](../adoption/recipes.md)
12. [Integration migration notes](../adoption/integration-migration-notes.md)
13. [Semver audit (2026-04-04)](../release/semver-audit-2026-04-04.md)
14. [DataTable V2 roadmap](./data-table-v2-roadmap.md)
15. [Public API semver contract](../governance/public-api-semver-contract.md)
16. [Headless core boundary](../governance/headless-core-boundary.md)
17. [Thin wrappers contract](../governance/wrapper-thin-contract.md)
18. [Multi-framework readiness gate](../governance/multi-framework-readiness.md)

## 1) Baseline snapshot

Источник: [`reports/adoption/latest.json`](../../reports/adoption/latest.json), policy docs.

1. Компоненты: `56`.
2. Stories coverage: `56 / 56`.
3. Unit coverage by components: `18 / 56`.
4. A11y coverage by components: `18 / 56`.
5. Tokens total: `97`.
6. Tokens used in UI: `80` (`0.825`).
7. Consumers in CI-metrics: `3` демо-приложения внутри репозитория (`consumers/sloi-pilot`, `consumers/sloi-analytics`, `consumers/sloi-operations`); внешних потребителей нет.
8. Unknown local token overrides in consumers: `0`.
9. Curated icon exports baseline: `68`.

## 2) Non-negotiable guardrails

1. Новые компоненты не приоритет до закрытия reliability/adoption gaps.
2. Tier-1 API не ломается без RFC + migration notes.
3. Компоненты используют semantic tokens, а не raw HEX.
4. Любая фича DataTable enterprise-класса идет только через `DataTableV2`.
5. Multi-framework expansion идет только после прохождения readiness gate.

## 3) Stage A - Reliable Core (complete)

Цель: довести Tier-1 до предсказуемости и regression safety.

Definition of Done:

1. Tier-1 unit coverage `>= 80%`.
2. Tier-1 a11y coverage `= 100%`.
3. API/Styling contract для Tier-1 зафиксирован и проверен на regression.
4. Quality gates в CI обязательны для merge.

Execution checklist:

- [x] `RC-01` Сформировать матрицу покрытия по каждому Tier-1 компоненту (unit + a11y + interaction). Артефакт: [Tier-1 test coverage matrix](../governance/tier-1-test-coverage-matrix.md).
- [x] `RC-02` Поднять `Button`, `Input`, `Select`, `Dialog`, `DropdownMenu`, `Tabs` до полного DoD Tier-1. Артефакты: [tier-1-test-coverage-matrix.md](../governance/tier-1-test-coverage-matrix.md), [tier-1-controlled-uncontrolled-contract.test.tsx](../../src/test/tier-1-controlled-uncontrolled-contract.test.tsx), [tier-1-styling-contract.test.tsx](../../src/test/tier-1-styling-contract.test.tsx).
- [x] `RC-03` Поднять `Checkbox`, `RadioGroup`, `Switch`, `Tooltip`, `Toast` до полного DoD Tier-1. Артефакты: [tier-1-test-coverage-matrix.md](../governance/tier-1-test-coverage-matrix.md), [form-controls.integration.test.tsx](../../src/shared/ui/form-controls.integration.test.tsx), [tier-1-controlled-uncontrolled-contract.test.tsx](../../src/test/tier-1-controlled-uncontrolled-contract.test.tsx), [tier-1-styling-contract.test.tsx](../../src/test/tier-1-styling-contract.test.tsx).
- [x] `RC-04` Закрыть Tier-1 regression-пакет для `DataTableV2` (keyboard/focus/layout). Артефакты: [data-table-v2.test.tsx](../../src/shared/ui/data-table-v2/data-table-v2.test.tsx), [data-table-v2.perf.test.tsx](../../src/shared/ui/data-table-v2/data-table-v2.perf.test.tsx), [data-table-v2-perf-note-2026-04-04.md](./data-table-v2-perf-note-2026-04-04.md), [data-table-v2-checklist-virtualization.md](./data-table-v2-checklist-virtualization.md).
- [x] `RC-05` Зафиксировать единый controlled/uncontrolled contract для Tier-1 и убрать API drift. Артефакты: [controlled/uncontrolled contract](../governance/controlled-uncontrolled-contract.md), [tier-1-controlled-uncontrolled-contract.test.tsx](../../src/test/tier-1-controlled-uncontrolled-contract.test.tsx).
- [x] `RC-06` Проверить и задокументировать styling contract Tier-1 (stable DOM/data-attributes/slots). Артефакты: [tier-1-styling-contract.md](../governance/tier-1-styling-contract.md), [tier-1-styling-contract.test.tsx](../../src/test/tier-1-styling-contract.test.tsx).

Verification commands:

1. `pnpm run typecheck`
2. `pnpm run lint`
3. `pnpm run test`
4. `pnpm run test:a11y`
5. `pnpm run storybook:build`

## 4) Stage B - Adoption (не достигнут)

Цель: доказать, что система работает в реальном продукте, а не только внутри UI-kit. Статус на 2026-11-26: есть только внутренние демо-приложения, реального внешнего потребителя нет, поэтому ярлык «Adoption-Proven» не применяем.

Definition of Done:

1. Минимум `1` реальный (внешний) consumer-проект подключен в adoption metrics. Пока не выполнено.
2. Есть backlog pain points по API, styling и docs.
3. Улучшения DX и docs подтверждены реальным use-case feedback.

Execution checklist:

- [ ] `AD-01` (по факту: подключены только внутренние демо-приложения, внешнего consumer нет) Подключить `1` реальный consumer в `adoption:metrics` pipeline. Артефакты: [consumers/sloi-operations/src/app.tsx](../../consumers/sloi-operations/src/app.tsx), [`adoption:metrics:ci` script](../../package.json), [`reports/adoption/latest.json`](../../reports/adoption/latest.json).
- [x] `AD-02` Добавить feedback-loop артефакт (таблица pain points + status + owner). Артефакт: [adoption/feedback-loop.md](../adoption/feedback-loop.md).
- [x] `AD-03` Добавить docs recipes для топ-сценариев (`form`, `modal form`, `table + filters`). Артефакт: [adoption/recipes.md](../adoption/recipes.md).
- [x] `AD-04` Проверить semver discipline для user-visible API changes. Артефакты: [semver-audit-2026-04-04.md](../release/semver-audit-2026-04-04.md), [versioning-policy.md](../release/versioning-policy.md), [release-checklist.md](../release/release-checklist.md).
- [x] `AD-05` Обновить migration notes по фактическим integration pain points. Артефакты: [integration-migration-notes.md](../adoption/integration-migration-notes.md), [data-table-v2-pinning-migration.md](./data-table-v2-pinning-migration.md), [data-table-v2-resize-migration.md](./data-table-v2-resize-migration.md), [data-table-v2-virtualization-migration.md](./data-table-v2-virtualization-migration.md).

Verification command:

1. `pnpm run adoption:metrics:ci`

## 5) Stage C - Full DS foundations and enterprise depth

Цель: закрыть foundation-layer и enterprise-уровень ключевых модулей.

Definition of Done:

1. Foundations complete: colors, typography, spacing, iconography, motion.
2. `DataTableV2` закрывает agreed enterprise feature-set.
3. Есть patterns уровня продуктовых сценариев, не только primitives/components.
4. Docs позволяют онбордить новую команду без устных договоренностей.

Execution checklist:

- [x] `FD-01` Формализовать Colors как отдельный foundation-модуль в `@sloi/tokens` (primitive -> semantic -> usage rules). Артефакты: [packages/tokens/src/colors.css](../../packages/tokens/src/colors.css), [packages/tokens/src/tokens.css](../../packages/tokens/src/tokens.css), [color-foundations.md](../governance/color-foundations.md).
- [x] `FD-02` Формализовать Typography/Spacing/Motion usage contracts и примеры. Артефакты: [packages/tokens/src/tokens.css](../../packages/tokens/src/tokens.css), [typography-spacing-motion-foundations.md](../governance/typography-spacing-motion-foundations.md), [styling-contract.md](../governance/styling-contract.md), [component-dod.md](../governance/component-dod.md).
- [x] `IC-01` Держать иконки в рабочем диапазоне `60-90` с use-case evidence для каждого добавления. Артефакты: [icon-use-case-evidence.md](../governance/icon-use-case-evidence.md), [iconography-color-token-policy.md](../governance/iconography-color-token-policy.md), [icons.test.ts](../../src/shared/ui/icon/icons.test.ts).
- [x] `IC-02` Зафиксировать icon a11y contract (decorative vs informative, labels, tone inheritance). Артефакты: [icon-a11y-contract.md](../governance/icon-a11y-contract.md), [icon.stories.tsx](../../src/shared/ui/icon/icon.stories.tsx), [icon.test.tsx](../../src/shared/ui/icon/icon.test.tsx), [icon.a11y.test.tsx](../../src/shared/ui/icon/icon.a11y.test.tsx).
- [x] `DT-01` Актуализировать статус `DataTableV2` phases по RFC/checklists и закрыть открытые пункты. Артефакты: [data-table-v2-roadmap.md](./data-table-v2-roadmap.md), [data-table-v2-checklist-column-pinning.md](./data-table-v2-checklist-column-pinning.md), [data-table-v2-checklist-column-resize.md](./data-table-v2-checklist-column-resize.md), [data-table-v2-checklist-virtualization.md](./data-table-v2-checklist-virtualization.md), [data-table-v2-rfc-virtualization.md](./data-table-v2-rfc-virtualization.md).
- [x] `DT-02` Закрыть для `DataTableV2` perf + a11y regression gates на enterprise-сценариях. Артефакты: [data-table-v2.perf.test.tsx](../../src/shared/ui/data-table-v2/data-table-v2.perf.test.tsx), [data-table-v2-perf-note-2026-04-04.md](./data-table-v2-perf-note-2026-04-04.md), [data-table-v2-checklist-virtualization.md](./data-table-v2-checklist-virtualization.md).
- [x] `PT-01` Добавить patterns: `auth form`, `search + filters`, `table toolbar`, `modal workflow`. Артефакты: [product-patterns.stories.tsx](../../src/shared/ui/patterns/product-patterns.stories.tsx), [product-patterns.stories.module.scss](../../src/shared/ui/patterns/product-patterns.stories.module.scss), [adoption/recipes.md](../adoption/recipes.md).

## 6) Multi-framework rollout gate (Lit + wrappers): заморожено (исследование, D36)

> Статус на 2026-11-26: Lit-обёрток нет (`@sloi/lit-wrappers` это заготовка со статусом `planned`), Go/No-Go критерий 2 ниже не выполнен (нет внешнего consumer). Отметки MF-01…MF-04 означают, что описан контракт и есть проверки для React-части; parity с Lit не измерялась, измерять нечего.

Решение: multi-framework поддержка правильна как стратегическое направление, но только через staged rollout с жестким gate.

Go/No-Go criteria перед стартом публичного multi-framework expansion:

1. Stage A DoD полностью выполнен.
2. Минимум `1` реальный consumer проходит через Stage B.
3. Нет открытых P1 reliability regression по Tier-1.
4. Foundation contracts по tokens/icons зафиксированы и соблюдаются.

Execution checklist:

- [x] `MF-01` Описать публичный API contract как semver-critical. Артефакты: [public-api-semver-contract.md](../governance/public-api-semver-contract.md), [release-checklist.md](../release/release-checklist.md).
- [x] `MF-02` Выделить headless core-пакет с логикой сложных компонентов (`Dialog`, `Select`, `Tooltip`, `Tabs`, `Combobox`). Артефакты: [packages/headless-core/README.md](../../packages/headless-core/README.md), [headless-core boundary](../governance/headless-core-boundary.md), [dialog.tsx](../../src/shared/ui/primitives/dialog/dialog.tsx), [select.tsx](../../src/shared/ui/primitives/select/select.tsx), [tabs.tsx](../../src/shared/ui/primitives/tabs/tabs.tsx), [tooltip.tsx](../../src/shared/ui/tooltip/tooltip.tsx), [combobox.tsx](../../src/shared/ui/combobox/combobox.tsx).
- [x] `MF-03` (контракт и React-часть; Lit это заготовка) Держать `Lit` и `React` как thin wrappers без дублирования логики. Артефакты: [wrapper-thin-contract.md](../governance/wrapper-thin-contract.md), [multi-framework-thin-wrappers-contract.test.ts](../../src/test/multi-framework-thin-wrappers-contract.test.ts), [packages/lit-wrappers/README.md](../../packages/lit-wrappers/README.md), [packages/lit-wrappers/package.json](../../packages/lit-wrappers/package.json).
- [x] `MF-04` (по факту: бюджеты бандла React, TS smoke, манифест; parity с Lit не измеряется) Валидировать bundle size, TS DX и a11y parity между рантаймами. Артефакты: [multi-framework-readiness.md](../governance/multi-framework-readiness.md), [multi-framework-a11y-parity.json](../governance/multi-framework-a11y-parity.json), [multi-framework-readiness.ts](../../scripts/multi-framework-readiness.ts), [ts smoke fixture](../../src/test/fixtures/multi-framework/consumer.ts), [quality-gate workflow](../../.github/workflows/quality-gate.yml), [multi-framework report](../../reports/multi-framework/latest.json).
- [ ] `MF-05` Открывать `Vue` только после подтвержденного спроса.

## 7) Working rhythm (anti-chaos)

1. Этот документ обновляется в каждом PR, который закрывает любой пункт чеклиста.
2. Раз в неделю фиксируется свежий baseline метрик и процент выполнения по Stage A/B/C.
3. Если KPI падают ниже порога, новые surface-level фичи замораживаются до восстановления метрик.
4. Все статус-изменения отражаются в `CHANGELOG.md` и релизных заметках при user-visible влиянии.

## 8) Immediate queue (what we do now)

1. `MF-05`: открывать `Vue` только после подтвержденного спроса и отдельного demand evidence.
