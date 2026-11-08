# Storybook Standards

Единые правила оформления stories для UI-kit.

## 1) Args first

1. Используй `args` как основной способ конфигурации stories.
2. Общие `args` клади на уровень `meta`.
3. Story-level `args` применяй только для переопределений.

## 2) Parameters hierarchy

1. Глобальные параметры задаются в `.storybook/preview.tsx`.
2. Компонентные параметры задаются в `meta.parameters`.
3. Story-level параметры применяй только для точечных сценариев.
4. Не дублируй одинаковые параметры на каждом story.

## 3) Decorators usage

1. Используй decorators для layout/harness и provider-моков.
2. Лишнюю разметку не вшивай в компонент, если это только story-контекст.
3. Для layout-переключения используй `parameters.pageLayout`.

## 4) Naming and structure

1. Иерархия: `Foundations/*`, `Primitives/*`, `UI/*`, `Patterns/*`.
2. Для новых UI-компонентов придерживайся stories:
   - `Default`
   - `States`
   - `Controlled` (если компонент поддерживает controlled API)
3. Используй CSF3 + `satisfies Meta<typeof Component>`.

## 5) Tags

1. По умолчанию stories маркируются как `stable` и `autodocs`.
2. Для нестабильных сценариев используй `experimental` или `wip`.
3. Для вспомогательных combo-story можно отключать `test` тег точечно.

## 6) Play/loaders/mocks

1. `play` используем для интерактивных сценариев, которые сложно показать статично.
2. `loaders` только для реальной необходимости, иначе используем `args`.
3. Для сетевых сценариев предпочитаем MSW.
4. Для модульных зависимостей используем Storybook-compatible mocking подход.

## 7) TypeScript and safety

1. Всегда типизируй `meta` и `StoryObj`.
2. Для кастомных args используй пересечение типов (`ComponentProps & CustomArgs`).
3. Избегай неserializable значений в `args` без `mapping`.
