# Thin Wrappers Contract (MF-03)

Документ фиксирует, что runtime wrappers (`React` и `Lit`) должны быть тонким слоем над headless contract без дублирования логики.

Дата baseline: `2026-04-06`.

> **Статус: заморожено (исследование, D36).** Lit-обёрток нет: `@sloi/lit-wrappers` это заготовка со статусом `planned`. Документ описывает намерение, а не реализованную возможность. Возобновляем только при подтверждённом спросе (`MF-05`).

## 1) Принцип

1. State/behavior logic хранится в `@sloi/headless-core`.
2. Wrappers отвечают только за:
   - rendering;
   - framework-specific composition;
   - className/token wiring;
   - accessibility атрибуты на уровне разметки.
3. Любая новая stateful логика сначала попадает в headless слой, затем подключается в wrapper.

## 2) React wrappers contract

Целевые wrappers:

1. [Dialog](/Users/sem/WebstormProjects/sloi-ui/src/shared/ui/primitives/dialog/dialog.tsx)
2. [Select](/Users/sem/WebstormProjects/sloi-ui/src/shared/ui/primitives/select/select.tsx)
3. [Tabs](/Users/sem/WebstormProjects/sloi-ui/src/shared/ui/primitives/tabs/tabs.tsx)
4. [Tooltip](/Users/sem/WebstormProjects/sloi-ui/src/shared/ui/tooltip/tooltip.tsx)
5. [Combobox](/Users/sem/WebstormProjects/sloi-ui/src/shared/ui/combobox/combobox.tsx)

Ограничения:

1. Wrapper-файлы импортируют controller из `@sloi/headless-core`.
2. Wrapper-файлы не содержат локальные state-machines через `useState`/`useReducer`/`useEffect` для domain behavior.
3. Controlled/uncontrolled semantics в wrappers не переопределяются и не расходятся с headless controller.

## 3) Lit wrappers contract

Пакет: [packages/lit-wrappers/README.md](/Users/sem/WebstormProjects/sloi-ui/packages/lit-wrappers/README.md)

Ограничения:

1. `Lit` wrappers не дублируют поведенческую логику, уже описанную в headless contract.
2. Любой runtime-specific behavior в Lit должен быть адаптером, а не альтернативной state-machine.
3. API names и semantics должны сохранять parity с React wrappers и публичным semver contract.

## 4) Verification artifacts

1. Static contract test: [multi-framework-thin-wrappers-contract.test.ts](/Users/sem/WebstormProjects/sloi-ui/src/test/multi-framework-thin-wrappers-contract.test.ts).
2. Headless boundary: [headless-core-boundary.md](./headless-core-boundary.md).
3. Public API semver gate: [public-api-semver-contract.md](./public-api-semver-contract.md).
4. Multi-framework readiness gate: [multi-framework-readiness.md](./multi-framework-readiness.md).
