# @sloi/headless-core

Headless state controllers for complex Sloi UI primitives and composite widgets.

## Scope

- `Dialog` open-state controller
- `Select` value/open controller
- `Tabs` value controller
- `Tooltip` open-state and delay contract
- `Combobox` filtering/selection/keyboard controller

## Exports

- `useControllableState`
- `useDialogController`
- `useSelectController`
- `useTabsController`
- `useTooltipController`
- `useComboboxController`

## Usage

This package is framework-agnostic at the UI layer and only owns state/behavior contracts.
Visual wrappers (for example React/Lit adapters) should consume these hooks and keep rendering concerns outside.
