# DataTable V2 Checklist - Column Resize

Связан с RFC: [DataTable V2 - Column Resize](./data-table-v2-rfc-column-resize.md)

Обновлено: 2026-04-03

## 1. Scope and API lock

- [x] Подтверждено, что resize реализуется только в `V2`.
- [x] Зафиксирован финальный resize API (controlled/uncontrolled).
- [x] Подтверждены границы `minColumnWidth` и `maxColumnWidth`.

## 2. Implementation

- [x] Реализованы resize handles для resizable колонок.
- [x] Поддержан pointer resize.
- [x] Поддержан keyboard resize.
- [x] Исключены layout breakpoints/regressions на supported viewport.

## 3. Storybook

- [x] Добавлен story `ResizeDefault`.
- [x] Добавлен story `ResizeMinMax`.
- [x] Добавлен story `ResizeKeyboard`.
- [x] Добавлен `play`-сценарий для keyboard resize.

## 4. Tests

- [x] Unit tests: изменение размеров и clamping по min/max.
- [x] Unit tests: controlled/uncontrolled parity.
- [x] Interaction tests: pointer + keyboard resize.
- [x] A11y tests: нет новых `error`-violations (`test:a11y`).

## 5. Docs and Release

- [x] Документация компонента обновлена для resize API.
- [x] Зафиксированы known limitations и рекомендации по usage.
- [x] Добавлены migration notes для resize-фазы.
- [x] Обновлен `CHANGELOG.md`.

## 6. Quality gates

- [x] `pnpm run typecheck`
- [x] `pnpm run lint`
- [x] `pnpm run test`
- [x] `pnpm run test:a11y`
- [x] `pnpm run storybook:build`

## 7. Sign-off

- [x] RFC acceptance criteria для resize закрыты.
- [x] Primary/backup owner scopes валидированы по governance matrix (`Data Experience Team` / `Design System Core`).

## 8. Sign-off record

1. Дата owner sign-off: `2026-04-03`.
2. Primary owner scope: `Data Experience Team`.
3. Backup owner scope: `Design System Core`.
4. Артефакты sign-off: [DataTable V2 roadmap](./data-table-v2-roadmap.md), [RFC column resize](./data-table-v2-rfc-column-resize.md), [Column resize migration notes](./data-table-v2-resize-migration.md).
