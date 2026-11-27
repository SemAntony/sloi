# Icon Use-Case Evidence Registry

Реестр фиксирует use-case evidence для curated icon inventory и обязателен для каждого нового добавления.

Связанные документы:

1. [Iconography and color token policy](./iconography-color-token-policy.md)
2. [Icon/Token change request template](./icon-token-change-request-template.md)
3. [Adoption feedback loop](../adoption/feedback-loop.md)

## 1) Baseline snapshot

Дата baseline: `2026-04-06`.

1. Curated exports: `68` иконок (рабочий диапазон policy: `60-90`).
2. Категории:
   - `actions`: `14`
   - `navigation`: `14`
   - `status`: `10`
   - `data`: `12`
   - `system`: `18`
3. Canonical source: [src/shared/ui/icon/icons.ts](../../src/shared/ui/icon/icons.ts).

## 2) Coverage evidence by category

| Category | Evidence type | Covered scenarios | Linked artifacts |
| --- | --- | --- | --- |
| `actions` | Tier-1 component flows + adoption recipes | add/edit/delete/save/upload/download actions in buttons/menus/toolbars | [Icon catalog story](../../src/shared/ui/icon/icon.stories.tsx), [Adoption recipes](../adoption/recipes.md) |
| `navigation` | Tier-1 primitives + app navigation patterns | arrows/chevrons/back/overflow for select, menus, pagination-like flows | [Icon catalog story](../../src/shared/ui/icon/icon.stories.tsx), [Navigation menu stories](../../src/shared/ui/primitives/navigation-menu/navigation-menu.stories.tsx) |
| `status` | Feedback/status semantics in UI states | info/success/warning/error/loading indicators in alerts/toasts/states | [Icon catalog story](../../src/shared/ui/icon/icon.stories.tsx), [States examples](../../src/shared/ui/patterns/states-examples.stories.tsx) |
| `data` | DataTableV2 enterprise features | sort/filter/columns/pin/resize visual affordances | [DataTable V2 roadmap](../backlog/data-table-v2-roadmap.md), [Column pinning checklist](../backlog/data-table-v2-checklist-column-pinning.md), [Column resize checklist](../backlog/data-table-v2-checklist-column-resize.md) |
| `system` | Consumer integration screens | search/settings/user/notification/form/system actions in pilot + real track consumers | [sloi-pilot](../../consumers/sloi-pilot/src/app.tsx), [sloi-analytics](../../consumers/sloi-analytics/src/app.tsx), [sloi-operations](../../consumers/sloi-operations/src/app.tsx) |

## 3) Addition log (mandatory for new icons)

Правило: любой PR, который меняет `ICON_LIBRARY_COUNT`, обязан добавить запись в таблицу.

| Date | Change | Evidence link | Consumer / Tier-1 scenario | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| `2026-04-03` | Baseline curated inventory initialized (`68` icons) | [Icon policy baseline](./iconography-color-token-policy.md) | Tier-1 + adoption tracks (`sloi-pilot`, `sloi-analytics`, `sloi-operations`) | Design System Core | `done` |

## 4) Entry template (copy-paste)

```md
| YYYY-MM-DD | `+IconName` (or `-IconName`) | issue/RFC link | consumer or Tier-1 scenario | owner | `planned/in-progress/done` |
```

## 5) Exit criteria for IC-01

1. Inventory остается в диапазоне `60-90`.
2. Для каждого нового добавления есть запись в этом реестре.
3. Добавление подтверждено через issue/RFC + story/tests/docs updates.
