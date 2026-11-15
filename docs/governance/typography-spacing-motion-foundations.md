# Typography, Spacing and Motion Foundations Module

Документ формализует foundation-контракт для typography, spacing/layout и motion в `@sloi/tokens`.

## 1) Canonical file map

1. Глобальные non-color tokens (`spacing`, `radius`, `size`, `typography`, `motion`): `packages/tokens/src/tokens.css`.
2. Typography utility presets (role-based classes): `packages/tokens/src/typography.css`.
3. Публичный агрегирующий entrypoint: `packages/tokens/src/styles.css`.
4. Compatibility-слой приложения: `src/app/styles/tokens.css` (только re-export, не source of truth).

## 2) Layering contract

1. Источник истины: `tokens.css` и `typography.css` из `@sloi/tokens`.
2. Компоненты в `src/shared/ui/*` используют только `--sloi-*` токены и typography roles.
3. Raw HEX для цвета запрещен; raw `ms`/`cubic-bezier` для motion в публичных компонентах запрещены.
4. Нестандартные значения (`1px`, оптические offsets) допускаются только как локальные исключения и не заменяют foundation scale.

## 3) Typography contract

1. Размер/line-height/weight задаются через `--sloi-font-*` токены.
2. Базовые роли текста:
   - `display`: `sloi-text-display-{lg|md}`;
   - `heading`: `sloi-text-heading-{lg|md|sm}`;
   - `body`: `sloi-text-body-{lg|md|sm}`;
   - `caption`: `sloi-text-caption`.
3. Контролы (button/input/select) используют label pair: `--sloi-font-size-label` + `--sloi-font-line-label`.
4. Цвет текста задается semantic tokens (`--sloi-text-primary|secondary|muted`), не raw color.

## 4) Spacing and layout contract

1. Margin/padding/gap строятся на `--sloi-space-*` scale.
2. Высота контролов берется из `--sloi-size-control-{sm|md|lg}`.
3. Радиусы берутся из `--sloi-radius-{sm|md|lg}`.
4. В новых компонентах избегаем ad-hoc spacing значений вне scale, если это не визуальная необходимость.

## 5) Motion contract

1. Duration scale:
   - `--sloi-motion-duration-instant`: `0ms`;
   - `--sloi-motion-duration-xs`: `110ms`;
   - `--sloi-motion-duration-sm`: `120ms`;
   - `--sloi-motion-duration-md`: `140ms`;
   - `--sloi-motion-duration-lg`: `160ms`;
   - `--sloi-motion-duration-xl`: `180ms`;
   - `--sloi-motion-duration-2xl`: `220ms`;
   - `--sloi-motion-duration-3xl`: `240ms`.
2. Easing scale:
   - `--sloi-motion-easing-standard`: `ease`;
   - `--sloi-motion-easing-emphasized`: `cubic-bezier(0.16, 1, 0.3, 1)`;
   - `--sloi-motion-easing-enter`: `ease-out`;
   - `--sloi-motion-easing-exit`: `ease-in`.
3. Публичные transition/animation в компонентах используют только motion tokens.
4. Для animated компонентов обязателен `@media (prefers-reduced-motion: reduce)` с `animation: none` и/или `transition: none`.
5. Exit motion не должен быть визуально тяжелее enter motion для того же UI-элемента.

## 6) Reference snippets

```css
.control {
  transition:
    border-color var(--sloi-motion-duration-sm) var(--sloi-motion-easing-standard),
    box-shadow var(--sloi-motion-duration-sm) var(--sloi-motion-easing-standard);
}

.overlay[data-state='open'] {
  animation: overlay-in var(--sloi-motion-duration-lg) var(--sloi-motion-easing-standard);
}

.overlay[data-state='closed'] {
  animation: overlay-out var(--sloi-motion-duration-md) var(--sloi-motion-easing-exit);
}

@media (prefers-reduced-motion: reduce) {
  .control {
    transition: none;
  }

  .overlay[data-state='open'],
  .overlay[data-state='closed'] {
    animation: none;
  }
}
```

## 7) Change policy

1. Добавление новых typography/spacing/motion tokens требует use-case evidence и обновления docs.
2. Переименование/удаление public foundation tokens рассматривается как semver-critical change.
3. После изменения foundation-токенов обязательно выполнить:
   - `pnpm run tokens:build`;
   - `pnpm run adoption:metrics:ci`;
   - quality gates: `typecheck`, `lint`, `test`, `test:a11y`, `storybook:build`.

## 8) Baseline targets

1. `tokens_used_in_ui / tokens_total >= 0.75`.
2. Unknown local `--sloi-*` overrides в consumers: `0`.
3. Новые компоненты не добавляют raw `ms`/`cubic-bezier` вне motion foundation scale.
