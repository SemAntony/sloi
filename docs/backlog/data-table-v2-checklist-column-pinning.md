# DataTable V2 Checklist - Column Pinning

Связан с RFC: [DataTable V2 - Column Pinning](./data-table-v2-rfc-column-pinning.md)

## 1. Scope and API lock

- [x] Подтверждено, что реализация идет только в `V2` и не трогает `V1 API`.
- [x] Зафиксирован финальный API pinning (controlled/uncontrolled).
- [x] Определены default-значения и edge-cases (`left/right` conflict, unknown column id).

## 2. Implementation

- [x] Реализован pin/unpin для `left`.
- [x] Реализован pin/unpin для `right`.
- [x] Корректно применяются sticky/offset стили для header и body.
- [x] Нет визуального рассинхрона header/body при горизонтальном скролле.

## 3. Storybook

- [x] Добавлен story `PinningDefault`.
- [x] Добавлен story `PinningLeft`.
- [x] Добавлен story `PinningRight`.
- [x] Добавлен story `PinningMixed`.
- [x] Добавлен `play`-сценарий с keyboard flow pin/unpin.

## 4. Tests

- [x] Unit tests: state transitions pin/unpin.
- [x] Unit tests: controlled/uncontrolled parity.
- [x] Interaction tests: pinning flows в Storybook.
- [x] A11y tests: нет новых `error`-violations (`test:a11y`).

## 5. Docs and Release

- [x] Обновлена документация компонента для pinning API.
- [x] Добавлены migration notes для adoption в `V2`.
- [x] Обновлен `CHANGELOG.md` (если есть user-visible изменения).

## 6. Quality gates

- [x] `pnpm run typecheck`
- [x] `pnpm run lint`
- [x] `pnpm run test`
- [x] `pnpm run test:a11y`
- [x] `pnpm run storybook:build`

## 7. Sign-off

- [x] RFC acceptance criteria для pinning закрыты.
- [x] Primary/backup owner подтвердили готовность к merge.

## 8. Sign-off record

1. Дата owner sign-off: `2026-03-31`.
2. Primary owner scope: `Data Experience Team`.
3. Backup owner scope: `Design System Core`.
4. Артефакты sign-off: [DataTable V2 roadmap](./data-table-v2-roadmap.md), [RFC column pinning](./data-table-v2-rfc-column-pinning.md).
