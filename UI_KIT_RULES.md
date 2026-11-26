# Sloi UI Kit Rules

Документ с правилами разработки UI-kit.  
Это единый источник истины для рефакторинга и добавления новых компонентов.
Процесс (ветки, проверки перед PR, semver, changeset) описан в [CONTRIBUTING.md](./CONTRIBUTING.md).

## Scope

- Технологический фокус: `React` + `Next.js`.
- `Vue/Angular` вне текущего scope.
- Архитектура: `FSD` (текущая структура проекта).

## Core Principles

1. Не реэкспортировать Radix как есть.  
Создаем наши обертки поверх `radix-ui` с собственными классами, типами и Storybook-сценариями.

2. Сохранять поведение Radix.  
Нельзя ломать `controlled/uncontrolled`, `asChild`, `Portal`, `data-*`-состояния и доступность.

3. Компоненты должны быть composable.  
Не зашиваем составные части жестко в `Root`, если это ограничивает сценарии использования.

## Styling Rules (Radix-aligned)

1. Все части должны принимать `className`.
2. Состояния стилизуются через `data-*` атрибуты (`data-state`, `data-side`, `data-disabled`, и т.д.).
3. Функциональные стили обязательны там, где они нужны для работы (например, `Overlay`, `Portal`-контент, позиционирование).
4. Базовый подход к стилям: `SCSS Modules` (`*.module.scss`).
5. Пользователь библиотеки должен иметь возможность переопределять стили через `className`.

## Animation Rules (Radix-aligned)

1. Базовый путь анимации: CSS keyframes + `data-state` (`open`/`closed`).
2. Для stateful primitive parts поддерживать обе фазы:
   - enter (`data-state="open"`)
   - exit (`data-state="closed"`)
3. Не ломать Radix unmount-suspense поведение при CSS-анимациях выхода.
4. Для JS animation libraries (`react-spring`, `framer-motion` и т.д.) поддерживать сценарий делегирования unmount через `forceMount` там, где это нужно.
5. Для JS-анимаций отдавать предпочтение подходу `asChild` + анимируемый wrapper-элемент, чтобы не терять поведение/типы Radix parts.

## Composition Rules (asChild)

1. Для всех relevant parts поддерживать `asChild`, если это предусмотрено Radix.
2. Если используем `asChild` с кастомным компонентом, компонент обязан:
   - спредить все входящие props на конечный DOM-элемент
   - форвардить `ref` через `React.forwardRef`
3. Leaf-компоненты дизайн-системы (кнопки, ссылки и т.д.) по умолчанию проектировать как совместимые с `asChild` (props spread + `forwardRef`).
4. При смене element type через `asChild` сохранять доступность:
   - элемент должен быть фокусируемым, если part ожидает focus/keyboard/pointer interaction
   - не заменять интерактивные части на нефокусируемые `div` без явной a11y-адаптации
5. Допускается глубокая композиция нескольких primitives через `asChild` (например `Tooltip.Trigger` + `Dialog.Trigger` + кастомная кнопка), если не ломаются semantics и interaction.
6. Любые изменения в обертках не должны ограничивать штатные composition-сценарии Radix.

## Tokens & Colors

1. Source of truth для токенов: DTCG-файлы в `packages/tokens/source/` (палитра в `primitives/palette.json`,
   `foundation.json` для `space`/`radius`/`size`/`font`/`motion`, семантика в `semantic/light.json` и `semantic/dark.json`).
2. Файлы в `packages/tokens/src/` (кроме `styles.css` и `typography.css`) генерируются командой `pnpm tokens:build`; руками их не правим.
   Подробности и соглашения по именам: [packages/tokens/README.md](./packages/tokens/README.md).
3. `src/app/styles/*` это тонкий слой совместимости, реэкспортирующий `@sloi/tokens`; новые токены туда не добавляем.
4. Не дублировать HEX в компонентных стилях, использовать токены (`--sloi-*`).
5. Новые семантические токены добавлять в `source/semantic/` (обе темы, dark только переопределения), а не в компоненты.
   Контраст проверяет `pnpm tokens:contrast`, отставание `src/` от `source/` ловит `pnpm test`.

## TypeScript & API Contract

1. Для оберток Radix использовать:
   - `React.forwardRef`
   - `React.ElementRef<typeof Primitive.Part>`
   - `React.ComponentPropsWithoutRef<typeof Primitive.Part>`
2. Указывать `displayName` для каждого `forwardRef`-компонента.
3. Не сужать API примитивов без явной причины.

## Next.js Compatibility

1. Публичный entry должен быть client-safe для App Router.
2. Для портальных компонентов поддерживать `container` (для сложных layout/iframe/microfrontend сценариев).
3. Избегать прямого доступа к `window/document` на уровне модуля.

## SSR Rules

1. Все primitives и обертки должны корректно работать в SSR/SSG сценариях (`Next.js`, `Remix`, `Gatsby`).
2. Базовая поддерживаемая версия React для библиотеки: `18+`.
3. Не добавлять API/поведение, которое опирается на клиент-only id генерацию до гидрации.
4. Любые `aria-*` связи, завязанные на id, должны оставаться корректными после server/client hydration.
5. При проектировании новых компонентов учитывать, что для пользователей скринридеров качество UX не должно зависеть от поздней гидрации.

## Storybook Standards

Для каждого компонента минимум:

1. `Default` сценарий.
2. `States` сценарий для компонентов с визуальными состояниями.
3. Минимум один edge-case сценарий (например, controlled, custom container, multi-part composition).
4. Демонстрация корректного использования API (без анти-паттернов относительно Radix).

Полный чек-лист нового компонента: [docs/governance/component-dod.md](./docs/governance/component-dod.md).

## Component Checklist (before merge)

1. API и типы корректны.
2. `className` прокинут во все нужные части.
3. `data-*` состояния используются в стилях.
4. Поведение Radix не сломано.
5. Есть Storybook-истории для основных и edge-case сценариев.
6. Проходят `typecheck`, `lint`, `test`, `test:a11y`, `build`, `storybook:build` (набор как в CI, см. CONTRIBUTING.md).
7. Изменение видно потребителю: добавлен changeset (`pnpm changeset`).

## Rule Updates

Новые правила добавляем в этот файл отдельным пунктом с датой и коротким обоснованием.

### 2026-03-29

- Зафиксированы базовые правила стилизации и расширения примитивов Radix.
- Добавлены правила анимации для enter/exit и делегирования unmount через `forceMount`.
- Добавлены правила композиции через `asChild` (props spread, `forwardRef`, a11y, deep composition).
- Добавлены правила SSR (React 18+, гидрация id, a11y-ограничения до гидрации).

### 2026-11-26

- Источник токенов теперь `packages/tokens/source/` (DTCG), а не `src/app/styles/*`; `src/app/styles` оставлен как слой совместимости.
- В Storybook Standards добавлен `States`, в чек-лист перед merge добавлены `test`, `test:a11y` и changeset.
- Убраны ссылки на матрицу владельцев и `CODEOWNERS` (там были команды-плейсхолдеры `@sloi/*`); решения принимает мейнтейнер репозитория.
