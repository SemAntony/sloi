# DataTable V1 Freeze

`DataTable V1 API` считается замороженным.

## Freeze rules

1. Новые тяжелые фичи в V1 не добавляются.
2. Изменения V1 допускаются только как bugfix или a11y-fix без API-расширения.
3. Любые новые capability идут только через отдельный RFC на V2 и отдельный V2 roadmap.
4. PR с `pinning`, `resize`, `virtualization` в `V1` считается blocking и не принимается.

## V1 behavior that must remain stable

- `client/server` режимы.
- Row selection.
- Bulk actions.
- Persistence (`sort`, `page`, `pageSize`, `visibleColumnIds`).
- Column visibility.

## Out of V1 scope

- Column pinning.
- Column resize.
- Virtualization.

См. [DataTable V2 backlog](./data-table-v2.md), [DataTable V2 RFC](./data-table-v2-rfc.md), [DataTable V2 roadmap](./data-table-v2-roadmap.md).
