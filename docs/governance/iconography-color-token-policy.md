# Iconography and Color Token Policy

Документ фиксирует границы роста foundation-слоя, чтобы система масштабировалась без распыления.

Шаблоны запросов и краткая версия:
1. [Icon/Token change request template](./icon-token-change-request-template.md)
2. [Iconography + color tokens one-pager](./iconography-color-token-one-pager.md)

## 1) Scope

1. Политика покрывает иконки, color-токены и правила их изменения.
2. Политика обязательна для `src/shared/ui/icon/*`, `packages/tokens/src/palette.css`, `packages/tokens/src/colors.css`, `packages/tokens/src/tokens.css`.
3. `src/app/styles/*` считается compatibility-слоем и не является canonical source для токенов.
4. Любые изменения вне этих правил считаются governance-risk и требуют RFC.

## 2) Baseline (as of 2026-04-06)

1. Primitive palette: `22` color families x `11` shades = `242` palette tokens.
2. Токены в `packages/tokens/src/colors.css` + `packages/tokens/src/tokens.css`:
   - `97` unique tokens total.
   - `50` unique color tokens.
   - `47` non-color tokens.
3. Dark theme overrides: `44` токена.
4. Иконки в foundation-контракте:
   - размеры: `sm | md | lg`;
   - тоны: `current | primary | secondary | muted | info | success | warning | danger`.
5. Curated icon exports в `src/shared/ui/icon/icons.ts`: `68` иконок (категории `actions`, `navigation`, `status`, `data`, `system`).

## 3) Iconography Policy

### 3.1 Inventory targets

1. Рабочий диапазон для текущей стадии: `60-90` approved icons.
2. Soft cap: `120` иконок.
3. Превышение `120` допускается только при RFC с доказанным adoption-use-case.

### 3.2 Coverage-first approach

1. Приоритет на coverage категорий, а не на абсолютный count:
   - actions (add, edit, delete, close, check);
   - navigation (arrow, chevron, back, external-link);
   - status (info, success, warning, error);
   - data/table (sort, filter, columns, pin);
   - form/system (calendar, search, upload, download, settings, user).
2. Иконка добавляется только при наличии конкретного сценария в Tier-1 компоненте или consumer-продукте.

### 3.3 Technical contract

1. Публичные компоненты используют `Icon` wrapper, а не произвольный inline SVG.
2. По умолчанию используется `tone='current'` для наследования цвета от контекста.
3. Для смысловых состояний используются только token-driven tones (`info/success/warning/danger`).
4. Нельзя задавать raw color (`fill`, `stroke`, `color`) через HEX внутри компонентных стилей.
5. Если иконка информативная (не декоративная), обязательно `decorative={false}` и `label`.
6. Добавление нового размера или tone требует RFC и обновления Storybook + tests + a11y.

### 3.4 Import rules (Icon-only)

1. В компонентах, stories и тестах используются только curated exports `Icon*` из `@sloi/ui-kit` или `src/shared/ui/icon/icons.ts`.
2. Прямой импорт из `lucide-react` вне `src/shared/ui/icon/icon.tsx` и `src/shared/ui/icon/icons.ts` запрещен.
3. Enforcement: правило зафиксировано в ESLint (`no-restricted-imports`).

### 3.5 Add/change checklist

1. Есть ссылка на use-case (issue/RFC/consumer ticket).
2. Подтверждено, что существующая иконка не покрывает сценарий.
3. Добавлен или обновлен Storybook пример.
4. Обновлены unit/a11y тесты при изменении поведения API.
5. Public-visible изменения отражены в `CHANGELOG.md`.

### 3.6 Use-case evidence registry

1. Baseline inventory и все дальнейшие добавления фиксируются в [Icon use-case evidence registry](./icon-use-case-evidence.md).
2. Любой PR, который меняет `ICON_LIBRARY_COUNT`, обязан добавить запись в registry.
3. Запись должна включать минимум: `дата`, `изменение`, `evidence link`, `consumer/Tier-1 scenario`, `owner`, `status`.

### 3.7 Accessibility contract

1. Decorative/informative contract, требования к `label` и правила icon-only controls фиксируются в [Icon accessibility contract](./icon-a11y-contract.md).
2. Изменения контракта считаются semver-critical и требуют RFC.

### 3.8 Deprecation

1. Иконка сначала помечается deprecated и получает replacement.
2. Удаление не раньше чем через `2` minor releases после deprecation notice.

## 4) Color Token Policy

### 4.1 Palette (primitive) rules

1. Primitive palette живет только в `packages/tokens/src/palette.css`.
2. Компоненты не должны использовать primitive tokens напрямую; только semantic tokens из `packages/tokens/src/tokens.css`.
3. Изменение family-count, shade-scale или brand mapping требует RFC и согласование owners.

### 4.2 Semantic color token rules

1. Semantic color tokens объявляются в `packages/tokens/src/colors.css` и используются во всех UI-компонентах.
2. Каждый новый semantic token обязан иметь:
   - четкий смысл (role), а не привязку к конкретному hue;
   - light/dark mapping (или явно задокументированную одинаковую value для обеих тем).
3. Предпочтительный нейминг: `--sloi-{domain}-{role}-{state?}`.

### 4.3 Budget limits

1. Recommended range для unique semantic color tokens: `45-70`.
2. Recommended range для всех unique tokens (color + non-color): `80-140`.
3. Если диапазон превышен, новые токены блокируются до consolidation pass (merge/cleanup/rename).

### 4.4 Forbidden patterns

1. Raw HEX в `src/shared/ui/*`.
2. Дублирующие semantic tokens с одинаковой ролью.
3. Consumer overrides с неизвестными `--sloi-*` именами.

## 5) KPI and Quality Gates

1. Обязательная проверка через `pnpm run adoption:metrics:ci`.
2. Минимальные KPI:
   - `unknown_local_overrides` в consumers = `0`;
   - `tokens_used_in_ui / tokens_total >= 0.75`;
   - каждое добавление иконки имеет usage evidence (Tier-1 или consumer).
3. Если KPI деградируют ниже порога, приоритет получают reliability/adoption задачи, а не расширение inventory.

## 6) Ownership and approval

1. Ownership и SLA берутся из [Owner matrix](./owners.md).
2. Для foundation-изменений требуется подтверждение primary + backup owner соответствующей зоны.

## 7) Definition of Done for icon/token changes

- [ ] Есть use-case и adoption evidence.
- [ ] Нет raw HEX в компонентном коде.
- [ ] Обновлены story/docs/tests.
- [ ] Соблюден semver-контракт и при необходимости добавлены migration notes.
- [ ] Пройдены quality gates: `typecheck`, `lint`, `test`, `test:a11y`, `storybook:build`, `adoption:metrics:ci`.
