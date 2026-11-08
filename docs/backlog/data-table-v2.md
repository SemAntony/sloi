# DataTable V2 Backlog

Это входная точка для `DataTable V2` трека.

См. связанные документы:

1. [DataTable V2 RFC](./data-table-v2-rfc.md)
2. [DataTable V2 roadmap](./data-table-v2-roadmap.md)
3. [DataTable V1 freeze](./data-table-v1-freeze.md)
4. [Column pinning RFC](./data-table-v2-rfc-column-pinning.md)
5. [Column resize RFC](./data-table-v2-rfc-column-resize.md)
6. [Virtualization RFC](./data-table-v2-rfc-virtualization.md)
7. [Column pinning checklist](./data-table-v2-checklist-column-pinning.md)
8. [Column resize checklist](./data-table-v2-checklist-column-resize.md)
9. [Virtualization checklist](./data-table-v2-checklist-virtualization.md)
10. [Phase 1 pinning implementation plan](./data-table-v2-phase1-pinning-plan.md)
11. [DataTable V2 pinning migration notes](./data-table-v2-pinning-migration.md)
12. [DataTable V2 resize migration notes](./data-table-v2-resize-migration.md)
13. [DataTable V2 virtualization migration notes](./data-table-v2-virtualization-migration.md)
14. [DataTableV2 perf note (2026-04-04)](./data-table-v2-perf-note-2026-04-04.md)
15. [Integration migration notes](../adoption/integration-migration-notes.md)

## Candidate features

1. Column pinning.
2. Column resize.
3. Virtualization.

## Preconditions

1. `V2 RFC` утвержден, и для каждой тяжелой фичи есть отдельный feature-level RFC.
2. Migration strategy с V1.
3. Storybook + unit + a11y regression coverage.
4. Performance budget и измеримый KPI.

## Execution policy

1. Тяжелые фичи (`pinning`, `resize`, `virtualization`) запрещены в `V1`.
2. Реализация идет только через `V2 RFC` и `V2 roadmap`.
3. Любые PR с тяжелыми фичами в `V1` считаются blocking.

## Non-goals for this step

1. Реализация V2 фич в коде.
2. Изменение текущего V1 контракта.
