# Tier-1 Test Coverage Matrix (RC-01)

Документ фиксирует фактическое покрытие Tier-1 слоя на `2026-04-04` и приоритетные test gaps для Stage A (`Reliable Core`).

## Scope

1. `Button`
2. `Input`
3. `Select`
4. `Dialog`
5. `DropdownMenu`
6. `Tabs`
7. `Checkbox`
8. `RadioGroup`
9. `Switch`
10. `Tooltip`
11. `Toast`
12. `DataTableV2`

## Method

1. Unit coverage: наличие `*.test.tsx` и число `it(...)` кейсов.
2. A11y coverage: наличие `*.a11y.test.tsx` и число `it(...)` кейсов.
3. Interaction coverage: число `play`-сценариев в Storybook stories.

## Snapshot Summary

1. Unit files: `12/12` Tier-1 компонентов.
2. A11y files: `12/12` Tier-1 компонентов.
3. Storybook interaction (`play`) coverage: `12/12` Tier-1 компонентов.
4. Дополнительно закрыт cross-component integration baseline: [form-controls.integration.test.tsx](../../src/shared/ui/form-controls.integration.test.tsx).
5. Главный gap Stage A сместился с наличия `play` на измеримые perf KPI для enterprise-режимов `DataTableV2`.

## Matrix

| Component | Unit | A11y | Storybook `play` | Status | Top gaps |
| --- | --- | --- | --- | --- | --- |
| `Button` | `5` кейсов: [button.test.tsx](../../src/shared/ui/button/button.test.tsx) | `2` кейса: [button.a11y.test.tsx](../../src/shared/ui/button/button.a11y.test.tsx) | `1`: [button.stories.tsx](../../src/shared/ui/button/button.stories.tsx) | strong-progress | Закрыты type override, styling contract, disabled click-guard и a11y depth для variant/disabled combinations; следующий шаг: consumer feedback hardening в Stage B. |
| `Input` | `5` кейсов: [input.test.tsx](../../src/shared/ui/input/input.test.tsx) | `2` кейса: [input.a11y.test.tsx](../../src/shared/ui/input/input.a11y.test.tsx) | `1`: [input.stories.tsx](../../src/shared/ui/input/input.stories.tsx) | strong-progress | Закрыты controlled mode, default type, edge attributes, described error-state a11y и form-integration baseline; следующий шаг: consumer feedback hardening в Stage B. |
| `Select` | `4` кейса: [select.test.tsx](../../src/shared/ui/primitives/select/select.test.tsx) | `2` кейса: [select.a11y.test.tsx](../../src/shared/ui/primitives/select/select.a11y.test.tsx) | `1`: [select.stories.tsx](../../src/shared/ui/primitives/select/select.stories.tsx) | strong-progress | Закрыты controlled callback, keyboard flow, disabled-item edge и a11y depth для open/closed states; следующий шаг: consumer feedback hardening в Stage B. |
| `Dialog` | `4` кейса: [dialog.test.tsx](../../src/shared/ui/primitives/dialog/dialog.test.tsx) | `2` кейса: [dialog.a11y.test.tsx](../../src/shared/ui/primitives/dialog/dialog.a11y.test.tsx) | `1`: [dialog.stories.tsx](../../src/shared/ui/primitives/dialog/dialog.stories.tsx) | strong-progress | Закрыты controlled callbacks, `Escape`, overlay close, focus restore и a11y open/closed states; следующий шаг: отдельные focus-trap edge и nested-dialog guards. |
| `DropdownMenu` | `5` кейсов: [dropdown-menu.test.tsx](../../src/shared/ui/primitives/dropdown-menu/dropdown-menu.test.tsx) | `2` кейса: [dropdown-menu.a11y.test.tsx](../../src/shared/ui/primitives/dropdown-menu/dropdown-menu.a11y.test.tsx) | `1`: [dropdown-menu.stories.tsx](../../src/shared/ui/primitives/dropdown-menu/dropdown-menu.stories.tsx) | strong-progress | Закрыты controlled state, keyboard select, disabled-item, checkbox-item regression и a11y open/closed states; следующий шаг: submenu keyboard traversal depth tests. |
| `Tabs` | `5` кейсов: [tabs.test.tsx](../../src/shared/ui/primitives/tabs/tabs.test.tsx) | `2` кейса: [tabs.a11y.test.tsx](../../src/shared/ui/primitives/tabs/tabs.a11y.test.tsx) | `1`: [tabs.stories.tsx](../../src/shared/ui/primitives/tabs/tabs.stories.tsx) | strong-progress | Закрыты controlled callback, keyboard auto/manual flows, disabled guard и vertical/manual a11y depth; следующий шаг: consumer feedback hardening в Stage B. |
| `Checkbox` | `5` кейсов: [checkbox.test.tsx](../../src/shared/ui/primitives/checkbox/checkbox.test.tsx) | `2` кейса: [checkbox.a11y.test.tsx](../../src/shared/ui/primitives/checkbox/checkbox.a11y.test.tsx) | `1`: [checkbox.stories.tsx](../../src/shared/ui/primitives/checkbox/checkbox.stories.tsx) | strong-progress | Закрыты controlled/disabled/indeterminate edge-кейсы, described mixed-state a11y и form-integration baseline; следующий шаг: consumer feedback hardening в Stage B. |
| `RadioGroup` | `5` кейсов: [radio-group.test.tsx](../../src/shared/ui/primitives/radio-group/radio-group.test.tsx) | `2` кейса: [radio-group.a11y.test.tsx](../../src/shared/ui/primitives/radio-group/radio-group.a11y.test.tsx) | `1`: [radio-group.stories.tsx](../../src/shared/ui/primitives/radio-group/radio-group.stories.tsx) | strong-progress | Закрыты controlled value, disabled guard, orientation contract, described horizontal a11y и form-integration baseline; следующий шаг: consumer feedback hardening в Stage B. |
| `Switch` | `5` кейсов: [switch.test.tsx](../../src/shared/ui/primitives/switch/switch.test.tsx) | `2` кейса: [switch.a11y.test.tsx](../../src/shared/ui/primitives/switch/switch.a11y.test.tsx) | `1`: [switch.stories.tsx](../../src/shared/ui/primitives/switch/switch.stories.tsx) | strong-progress | Закрыты controlled callback, disabled guard, form serialization, described checked-state a11y и form-integration baseline; следующий шаг: consumer feedback hardening в Stage B. |
| `Tooltip` | `5` кейсов: [tooltip.test.tsx](../../src/shared/ui/tooltip/tooltip.test.tsx) | `2` кейса: [tooltip.a11y.test.tsx](../../src/shared/ui/tooltip/tooltip.a11y.test.tsx) | `1`: [tooltip.stories.tsx](../../src/shared/ui/tooltip/tooltip.stories.tsx) | strong-progress | Закрыты hover/focus flows, controlled callbacks, custom-container contract и a11y open/closed states; следующий шаг: multi-trigger/portal edge cases. |
| `Toast` | `5` кейсов: [toast.test.tsx](../../src/shared/ui/primitives/toast/toast.test.tsx) | `2` кейса: [toast.a11y.test.tsx](../../src/shared/ui/primitives/toast/toast.a11y.test.tsx) | `1`: [toast.stories.tsx](../../src/shared/ui/primitives/toast/toast.stories.tsx) | strong-progress | Закрыты open/close callback, action callback, hidden-state, viewport label и a11y open/closed states; следующий шаг: lifecycle edge (`duration`, swipe, hotkey behavior) в integration тестах. |
| `DataTableV2` | `18` кейсов: [data-table-v2.test.tsx](../../src/shared/ui/data-table-v2/data-table-v2.test.tsx), [data-table-v2.perf.test.tsx](../../src/shared/ui/data-table-v2/data-table-v2.perf.test.tsx) | `4` кейса: [data-table-v2.a11y.test.tsx](../../src/shared/ui/data-table-v2/data-table-v2.a11y.test.tsx) | `6`: [data-table-v2.stories.tsx](../../src/shared/ui/data-table-v2/data-table-v2.stories.tsx) | strong | Закрыт combined smoke/perf gate для `pinning + resize + virtualization`, KPI `TTFSR/FPS/long task` подтверждены: [perf note](../backlog/data-table-v2-perf-note-2026-04-04.md). Следующий шаг: adoption feedback hardening в Stage B. |

## Priority Queue (from this matrix)

1. `P0` baseline выполнен: Tier-1 unit coverage доведен до `3-5+` сценариев на компонент.
2. `P1` выполнен: a11y depth для Tier-1 baseline закрыт (включая overlay open/closed и form-controls described states).
3. `P1` выполнен: cross-component integration depth добавлен для `Input/Checkbox/RadioGroup/Switch` через [form-controls.integration.test.tsx](../../src/shared/ui/form-controls.integration.test.tsx).
4. `P1` выполнен: contract layer закреплен через [controlled-uncontrolled-contract.md](./controlled-uncontrolled-contract.md), [tier-1-styling-contract.md](./tier-1-styling-contract.md), [tier-1-controlled-uncontrolled-contract.test.tsx](../../src/test/tier-1-controlled-uncontrolled-contract.test.tsx) и [tier-1-styling-contract.test.tsx](../../src/test/tier-1-styling-contract.test.tsx).
5. `P1` выполнен: для `DataTableV2` закрыт combined smoke/perf gate и количественные KPI (`TTFSR/FPS/long task`) через [data-table-v2.perf.test.tsx](../../src/shared/ui/data-table-v2/data-table-v2.perf.test.tsx) и [perf note](../backlog/data-table-v2-perf-note-2026-04-04.md).
