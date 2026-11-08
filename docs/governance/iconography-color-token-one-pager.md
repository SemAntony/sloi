# Iconography + Color Tokens One-Pager

Короткая версия policy для команды и новых участников.

Полный документ: [Iconography and color token policy](./iconography-color-token-policy.md)

## Где мы сейчас (2026-04-06)

1. Palette: `22` families x `11` shades (`242` primitive tokens).
2. Color foundations вынесены в `packages/tokens/src/colors.css` (`primitive -> semantic`).
3. `packages/tokens/src/tokens.css`: `97` unique semantic/global tokens, из них `50` color tokens.
4. Dark theme: `44` overrides.
5. Icon foundation уже имеет базовый контракт:
   - sizes: `sm | md | lg`
   - tones: `current | primary | secondary | muted | info | success | warning | danger`
6. Curated icon set уже добавлен: `68` иконок (экспорт через `src/shared/ui/icon/icons.ts`).

## Целевые рамки без распыления

1. Иконки:
   - рабочий диапазон: `60-90`;
   - soft cap: `120` (выше только через RFC).
2. Semantic color tokens:
   - целевой диапазон: `45-70`.
3. Общий token budget (color + non-color):
   - целевой диапазон: `80-140`.

## Правила добавления

1. Нельзя добавить иконку/токен без конкретного use-case.
2. Сначала переиспользуем существующие assets, потом добавляем новые.
3. В компонентах запрещен raw HEX; используем только semantic tokens.
4. Иконки по умолчанию используют `tone='current'`.
5. Информативные иконки обязательны с `decorative={false}` + `label`.
6. В компонентах/stories/tests используем только `Icon*` экспорты; прямой `lucide-react` запрещен (кроме инфраструктурного `icon`-слоя).
7. Каждое добавление иконки фиксируется в [icon evidence registry](./icon-use-case-evidence.md).
8. A11y-правила для decorative/informative/icon-only сценариев фиксируются в [icon a11y contract](./icon-a11y-contract.md).

## Когда issue, когда RFC

1. `Issue`:
   - локальное добавление иконки;
   - новый semantic token без изменения foundation-модели.
2. `RFC`:
   - изменение `Icon` API;
   - изменение palette/semantic-архитектуры;
   - любой breaking или cross-component impact.

Шаблон запроса: [Icon/Token change request template](./icon-token-change-request-template.md)

## KPI-гейты

1. `unknown_local_overrides` в consumers = `0`.
2. `tokens_used_in_ui / tokens_total >= 0.75`.
3. Каждое добавление иконки подтверждено usage evidence.
4. Обязательный CI набор: `typecheck`, `lint`, `test`, `test:a11y`, `storybook:build`, `adoption:metrics:ci`.

## Быстрый DoD для icon/token изменений

- [ ] Есть use-case + evidence.
- [ ] Нет raw HEX в компонентном коде.
- [ ] Обновлены story/docs/tests.
- [ ] Обновлен changelog (если изменение user-visible).
