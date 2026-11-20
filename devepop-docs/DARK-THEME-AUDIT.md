# Аудит тёмной темы (D25)

Дата: 2026-11-18. Вход для D26 (исправления). В D25 ничего не менялось, только измерения.

Источники: `pnpm tokens:contrast` (пары из `contrast-pairs.json`, обе темы) и разовый расчёт
по собранным `palette.css` + `colors.css` для мест, которые axe и скрипт не покрывают (градиенты, stories).
Порог: текст 4.5:1, нетекстовые элементы (граница поля, индикатор) 3:1 (WCAG 1.4.3 / 1.4.11).

## 1. Покрытие: есть ли у токена светлой темы тёмный аналог

Светлых семантических токенов 55, переопределений в dark 44, токенов только в dark нет.
Не переопределены 11:

| Токен | Статус | Комментарий |
|---|---|---|
| `text.on-danger`, `interactive.danger-{bg,bg-hover,bg-active,text,shadow}` | ок | Фиксированные значения, фон и текст не зависят от темы. Контраст текста 5.6–9.2:1 в обеих темах (пара добавлена в D22). |
| `interactive.primary-text` | ок | Алиас `text.on-primary`. Сам `text.on-primary` в dark совпадает со светлым значением, и это источник провала в п. 2. |
| `accent.{violet,cyan,fuchsia,rose}` | замечание | Тёмных значений нет. Используются только в story иконок и исключены из пар контраста. В dark как графика: violet 3.03 / 2.49 (base / elevated), fuchsia 4.12 / 3.39, rose 4.49 / 3.69, cyan 4.93 / 4.05. Реальный риск только у violet на elevated. |

## 2. Контраст токенов (пары из A3)

| Тема | Пар | ок | FAIL | известные | advisory |
|---|---|---|---|---|---|
| light | 65 | 55 | 0 | 2 | 8 |
| dark | 65 | 52 | 0 | 5 | 8 |

Известные провалы (все для D26):

| Тема | Пара | Контраст | Порог |
|---|---|---|---|
| light | `field-border` на `field-bg` | 1.43:1 | 3 |
| light | `field-border-invalid` на `field-bg` | 2.77:1 | 3 |
| dark | `text-on-primary` / `interactive-primary-text` на `interactive-primary-bg` | 2.59:1 | 4.5 |
| dark | `text-on-primary` / `interactive-primary-text` на `interactive-primary-bg-hover` | 3.67:1 | 4.5 |
| dark | `field-border` на `field-bg` | 1.40:1 | 3 |

Advisory (границы карточек и статусов, декоративные, не блокируют): `border-primary` и `surface-floating-border`
на поверхностях 1.40–2.31:1; `status-*-border` на `status-*-bg` 1.53–2.84:1 в обеих темах.

## 3. Градиенты (axe их не считает)

Значения контраста для концов градиента (линейная интерполяция, худшая точка на одном из концов).

| Место | light | dark | Вердикт |
|---|---|---|---|
| Button primary, текст на bg → hover | 5.10 / 6.70 | **2.59 / 3.67** | dark провал (то же, что в п. 2) |
| Button primary, hover → active | 6.70 / 8.65 | 3.67 / 5.10 | dark: начало hover-градиента провал |
| Button danger (новый), все состояния | 5.63 – 9.23 | 5.63 – 9.23 | ок |
| Progress, индикатор на треке (нужно 3:1) | 5.10 / 6.70, complete 4.35 | 5.43 / 3.84, complete 5.99 | ок |
| Skeleton, края градиента на `surface-base` | **1.00 / 1.00** | **1.17 / 1.11** | см. ниже |

Skeleton: декоративный, WCAG не требует, но в светлой теме `surface-elevated` (zinc-1 `#fafafa`) практически
равен `surface-base` (gray-1 `#f9fafb`), поэтому заглушка на странице невидима; в dark почти не видна (1.1:1).
Это функциональная проблема, а не проблема доступности.

## 4. Stories с «сырой» палитрой

| Story | Что не так | light | dark |
|---|---|---|---|
| `aspect-ratio.stories.module.scss` | Градиент `palette-blue-2 → cyan-2` (пастельный) не зависит от темы, а текст `text-secondary` в dark светлый | 11.9 / 13.0 | **1.12 / 1.03** |
| `context-menu.stories.module.scss` | `palette-cyan-2` 70% поверх `surface-elevated`, текст `text-secondary` | 13.3 | **1.88** |
| `navigation-menu.stories.module.scss` | Через `color-mix` с токенами, адаптируется | 14.8 | 10.4 (ок) |

## 5. Что берёт D26

Приоритет по влиянию на продукт:

1. **Dark: primary-кнопка.** Текст `text-on-primary` на `interactive-primary-bg` 2.59:1 (hover 3.67:1). Нужен тёмный `text.on-primary` или более тёмный фон. Затрагивает Button, Progress (по цвету) и все Tier-1 компоненты с primary.
2. **Граница поля** (`field-border`), обе темы: 1.40–1.43:1 при пороге 3:1 (WCAG 1.4.11). Затрагивает Input, Textarea, NumberField, PhoneField, SearchInput, Select, Combobox.
3. **`field-border-invalid`, light:** 2.77:1, нужно 3:1.
4. **Skeleton:** отдельный токен или более заметная заливка (сейчас 1.00–1.17:1).
5. **Stories** `aspect-ratio` и `context-menu`: заменить `palette-*-2` на семантические токены или тематические значения.
6. **accent.\*** (низкий приоритет): тёмные значения, если они останутся в публичной палитре; violet на elevated 2.49:1.

Не входит: advisory-границы карточек и статусов (декоративные, решение по дизайну).
