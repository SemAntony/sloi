# Storybook Testing Rules

Этот документ фиксирует минимальный, стабильный тестовый контур для текущего стека (`storybook@8.6.x`).

## Stack

1. Interaction tests: `play` функции в stories + утилиты из `@storybook/test`.
2. Accessibility checks in Storybook: `@storybook/addon-a11y`.
3. Unit tests: `vitest` + `@testing-library/react`.
4. A11y unit tests: `vitest` + `vitest-axe`.

## Story-level requirements

1. Для интерактивных сценариев добавляй `play` в stories `Default`, `Controlled` или отдельный `Interaction`.
2. Все `userEvent` и `expect` в `play` должны быть `await`.
3. Проверки в `play` группируй через `step` для читаемого дебага.
4. Предпочитай доступные queries: `getByRole`, `getByLabelText`, `findByRole`.

## A11y policy

1. Проектный default: `parameters.a11y.test = 'error'` в `.storybook/preview.tsx`.
2. Временные исключения помечаются `a11y.test = 'todo'` на уровне конкретного компонента/story.
3. `a11y.test = 'off'` допустим только для намеренных anti-pattern stories.

## CI / Quality Gate

Перед релизом обязательно:

1. `pnpm run typecheck`
2. `pnpm run lint`
3. `pnpm run test`
4. `pnpm run test:a11y`
5. `pnpm run storybook:build`
6. `pnpm run mf:validate`

## Version note

`@storybook/addon-vitest` доступен в более новых версиях Storybook (9+). Для текущего `8.6.x` используем описанный выше контур.
