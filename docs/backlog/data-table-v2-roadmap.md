# DataTable V2 Roadmap

Отдельный roadmap для тяжелых фич таблицы. Этот документ не разрешает изменение `DataTable V1 API`.

## Guardrails

1. `column pinning`, `column resize`, `virtualization` реализуются только в `V2`.
2. Любая попытка добавить тяжелые фичи в `V1` считается blocking.
3. Каждая фаза roadmap стартует только после approved feature-level RFC.
4. Для каждой фазы обязательны quality gates: `typecheck`, `lint`, `test`, `test:a11y`, `storybook:build`.

## Current status (as of 2026-04-06)

1. Phase 0: complete.
2. Phase 1 (`column pinning`): complete.
3. Phase 2 (`column resize`): complete (API, layout regression checks, quality gates, sign-off).
4. Phase 3 (`virtualization`): complete (API, stories, unit/a11y regression checks, combined smoke/perf gate and KPI validation closed via [perf-note](./data-table-v2-perf-note-2026-04-04.md), owner sign-off completed).
5. Phase 4 (`adoption and GA`): started (pilot + real consumer tracks подключены в adoption metrics; GA decision pending).

## Phase Sign-off Registry

1. Phase 1 (`column pinning`) sign-off: completed on `2026-03-31` (`Data Experience Team` + `Design System Core`).
2. Phase 2 (`column resize`) sign-off: completed on `2026-04-03` (`Data Experience Team` + `Design System Core`).
3. Phase 3 (`virtualization`) sign-off: completed on `2026-04-06` (`Data Experience Team` + `Design System Core`).
4. Registry sources:
   - [Column pinning checklist](./data-table-v2-checklist-column-pinning.md)
   - [Column resize checklist](./data-table-v2-checklist-column-resize.md)
   - [Virtualization checklist](./data-table-v2-checklist-virtualization.md)

## Phase 0: Discovery and Contracts

1. Зафиксировать feature RFC для каждой тяжелой фичи.
2. Определить базовый API-контур `V2` и migration strategy.
3. Зафиксировать перф-метрики и baseline-сценарии.

Feature RFCs:

1. [Column pinning RFC](./data-table-v2-rfc-column-pinning.md)
2. [Column resize RFC](./data-table-v2-rfc-column-resize.md)
3. [Virtualization RFC](./data-table-v2-rfc-virtualization.md)

Definition of done:

1. Approved RFC-пакет по `pinning`, `resize`, `virtualization`.
2. Формализованные acceptance-критерии и перф-бюджет.

## Phase 1: Column Pinning

1. Реализовать pinning в `V2` без влияния на `V1`.
2. Добавить Storybook stories для основных и edge-state сценариев.
3. Закрыть keyboard/a11y проверки для pinned/unpinned потоков.
4. Выполнить [Column pinning checklist](./data-table-v2-checklist-column-pinning.md).
5. Следовать [Phase 1 pinning implementation plan](./data-table-v2-phase1-pinning-plan.md).

Definition of done:

1. Фича проходит quality gates.
2. Добавлены migration notes для раннего adoption.

## Phase 2: Column Resize

1. Реализовать resize behavior с token-only styling.
2. Поддержать pointer + keyboard resize сценарии.
3. Добавить regression tests на layout stability.
4. Выполнить [Column resize checklist](./data-table-v2-checklist-column-resize.md).

Definition of done:

1. Нет деградации текущих сценариев `V2`.
2. A11y checks и interaction tests стабильны.

## Phase 3: Virtualization

1. Реализовать virtualization для больших наборов данных.
2. Обеспечить корректные aria/table semantics в виртуализированном режиме.
3. Подтвердить перф-цели на репрезентативных data sizes.
4. Выполнить [Virtualization checklist](./data-table-v2-checklist-virtualization.md).

Definition of done:

1. Перф-бюджет выполнен.
2. A11y и keyboard сценарии закрыты в тестах.

## Phase 4: Adoption and GA

1. Провести пилот в ограниченном числе consumer-продуктов.
2. Собрать adoption-метрики и feedback.
3. Принять решение о GA и долгосрочной поддержке `V1`/`V2`.

Definition of done:

1. Published changelog с migration section.
2. Команда зафиксировала GA-статус и SLA поддержки.

## Out of scope for this roadmap step

1. Принудительная миграция всех продуктов на `V2`.
2. Breaking changes в `V1`.
