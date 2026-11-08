# DataTable V2 Checklist - Virtualization

Связан с RFC: [DataTable V2 - Virtualization](./data-table-v2-rfc-virtualization.md)

Обновлено: 2026-04-06

## 1. Scope and API lock

- [x] Подтверждено, что virtualization добавляется только в `V2`.
- [x] Зафиксирован финальный API (`enableVirtualization`, `rowHeight`, `overscan`).
- [x] Определен reference dataset для перф-проверок.

## 2. Implementation

- [x] Реализован виртуализированный рендер строк.
- [x] Поддержан стабильный focus при скролле/перерисовке.
- [x] Сохранены table semantics (`table`, `row`, `cell`, `columnheader`).
- [x] Совместимость проверена с selection/sort/pagination в `V2`.

## 3. Storybook

- [x] Добавлен story `VirtualizationSmallDataset`.
- [x] Добавлен story `VirtualizationLargeDataset`.
- [x] Добавлен `play`-сценарий на keyboard-навигацию в виртуализированном режиме.

## 4. Tests

- [x] Unit tests: windowing/overscan logic.
- [x] Interaction tests: scroll + keyboard behavior.
- [x] A11y tests: нет новых `error`-violations (`test:a11y`).
- [x] Regression tests: отсутствие потери строк/фокуса на границах viewport.

## 5. Performance

- [x] Добавлен combined smoke/perf regression gate для режима `pinning + resize + virtualization` на dataset `1200` строк.
- [x] Time to first stable table render <= 1500ms на reference dataset.
- [x] Average scroll frame rate >= 50 FPS на reference viewport.
- [x] Max long task during scroll < 120ms.
- [x] Перф-результаты задокументированы в perf-note: [DataTableV2 Perf Note (2026-04-04)](./data-table-v2-perf-note-2026-04-04.md).

## 6. Docs and Release

- [x] Документация компонента обновлена для virtualization API.
- [x] Описаны ограничения virtualization и guidance по usage.
- [x] Добавлены migration notes для virtualization.
- [x] Обновлен `CHANGELOG.md`.

## 7. Quality gates

- [x] `pnpm run typecheck`
- [x] `pnpm run lint`
- [x] `pnpm run test`
- [x] `pnpm run test:a11y`
- [x] `pnpm run storybook:build`

## 8. Sign-off

- [x] RFC acceptance criteria для virtualization закрыты.
- [x] Primary/backup owner подтвердили готовность к merge.

## 9. Sign-off record

1. Дата owner sign-off: `2026-04-06`.
2. Primary owner scope: `Data Experience Team`.
3. Backup owner scope: `Design System Core`.
4. Артефакты sign-off: [DataTable V2 roadmap](./data-table-v2-roadmap.md), [RFC virtualization](./data-table-v2-rfc-virtualization.md), [DataTableV2 perf note (2026-04-04)](./data-table-v2-perf-note-2026-04-04.md).
