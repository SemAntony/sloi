# Headless Core Boundary (MF-02)

Документ фиксирует границу ответственности между `@sloi/headless-core` и UI wrappers.

Дата baseline: `2026-04-06`.

> **Статус:** `@sloi/headless-core` используется React-компонентами и вшивается в бандл `@sloi/ui-kit`. Часть про Lit-обёртки заморожена (исследование, D36): Lit-обёрток нет.

## 1) Цель

Сложная поведенческая логика должна жить в headless-пакете, а визуальные слои (`@sloi/ui-kit`, будущие Lit/React wrappers) должны быть thin adapters без дублирования state-машин.

## 2) Что вынесено в `@sloi/headless-core`

Пакет: [packages/headless-core](../../packages/headless-core/README.md)

Экспортируемые контроллеры:

1. `useDialogController`
2. `useSelectController`
3. `useTabsController`
4. `useTooltipController`
5. `useComboboxController`
6. `useControllableState` (общий primitive для controlled/uncontrolled parity)

## 3) Wrapper integration map

| UI wrapper | Headless controller |
| --- | --- |
| [Dialog](../../src/shared/ui/primitives/dialog/dialog.tsx) | `useDialogController` |
| [Select](../../src/shared/ui/primitives/select/select.tsx) | `useSelectController` |
| [Tabs](../../src/shared/ui/primitives/tabs/tabs.tsx) | `useTabsController` |
| [Tooltip](../../src/shared/ui/tooltip/tooltip.tsx) | `useTooltipController` |
| [Combobox](../../src/shared/ui/combobox/combobox.tsx) | `useComboboxController` |

## 4) Rules for future changes

1. Новый stateful behavior для перечисленных компонентов сначала добавляется в `@sloi/headless-core`.
2. UI wrappers могут добавлять только presentation concerns:
   - class hooks;
   - token-based styles;
   - composition API вокруг headless контрактов.
3. Изменение controlled/uncontrolled semantics в headless контроллерах считается semver-critical и проходит через [Public API semver contract](./public-api-semver-contract.md).
4. Wrapper-уровень не должен внедрять альтернативные state-источники, которые расходятся с headless contract.

## 5) Verification

1. `pnpm run typecheck`
2. `pnpm run lint`
3. `pnpm run test`
4. `pnpm run test:a11y`
5. `pnpm run storybook:build`
6. Thin wrapper static checks: [multi-framework-thin-wrappers-contract.test.ts](../../src/test/multi-framework-thin-wrappers-contract.test.ts)
7. Multi-framework readiness gate: `pnpm run mf:validate` ([multi-framework-readiness.md](./multi-framework-readiness.md))
