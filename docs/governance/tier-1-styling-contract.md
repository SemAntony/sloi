# Tier-1 Styling Contract

Документ фиксирует стабильные styling hooks для Tier-1 компонентов: где consumer может безопасно применять `className` и на какие `data-*`/DOM точки можно опираться без риска внезапного API drift.

Дата baseline: `2026-04-04`.

## 1) Global guardrails

1. Публичные hooks из таблицы ниже считаются semver-critical.
2. Удаление/переименование hooks допускается только через `major` + migration notes.
3. Недокументированные внутренние узлы не считаются публичным контрактом.
4. Для кастомизации приоритет: token override -> documented `className`/`data-*` hooks.

## 2) Tier-1 stable hooks matrix

| Component | Stable class hooks | Stable state/DOM hooks |
| --- | --- | --- |
| `Button` | `Button.className` (root), `asChild` class forwarding | native `disabled`, `focus-visible` |
| `Input` | `Input.className` (root) | `data-invalid` |
| `Select` | `SelectTrigger.className`, `SelectContent.className`, `SelectItem.className` | `data-state`, `data-side`, `data-disabled` |
| `Dialog` | `DialogOverlay.className`, `DialogContent.className`, `DialogTitle.className`, `DialogDescription.className`, `DialogCloseButton.className` | `data-state` |
| `DropdownMenu` | `DropdownMenuTrigger.className`, `DropdownMenuContent.className`, `DropdownMenuItem.className`, `DropdownMenuSubContent.className` | `data-state`, `data-side`, `data-disabled` |
| `Tabs` | `Tabs.className`, `TabsList.className`, `TabsTrigger.className`, `TabsContent.className` | `data-state`, `data-orientation` |
| `Checkbox` | `Checkbox.className`, `CheckboxIndicator.className` | `data-state`, `data-disabled` |
| `RadioGroup` | `RadioGroup.className`, `RadioGroupItem.className`, `RadioGroupIndicator.className` | `data-state`, `disabled` |
| `Switch` | `Switch.className`, `SwitchThumb.className` | `data-state`, `data-disabled` |
| `Tooltip` | `Tooltip.className` (content), `Tooltip.arrowClassName` (arrow) | `data-state`, `data-side` |
| `Toast` | `Toast.className`, `ToastViewport.className`, `ToastTitle.className`, `ToastDescription.className`, `ToastAction.className`, `ToastClose.className` | `data-state`, `data-swipe`, `data-swipe-direction` |
| `DataTableV2` | `DataTableV2.className` (root) | `data-row-key`, `aria-label='Resize column …'`, `aria-label='DataTable virtualized viewport'` |

## 3) Non-goals (explicitly unstable)

1. CSS module internal class names (`styles.*`) не являются публичными hooks.
2. Глубокие селекторы по внутренней иерархии (`.a .b > .c`) не гарантируются.
3. Порядок внутренних оберток и служебных узлов не фиксируется.

## 4) Verification artifacts

1. Styling regression suite: [tier-1-styling-contract.test.tsx](/Users/sem/WebstormProjects/sloi-ui/src/test/tier-1-styling-contract.test.tsx).
2. Общая политика стилизации: [styling-contract.md](./styling-contract.md).
3. Stage tracking: [design-system-execution-plan.md](../backlog/design-system-execution-plan.md).
