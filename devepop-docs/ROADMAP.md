# ROADMAP: sloi-ui (план «по задаче в день»)

Создан: 2026-11-08. Рабочий план после паузы (последняя активность ~2026-04-06).
Старый `docs/backlog/design-system-execution-plan.md` считается завершённым; вся новая работа идёт здесь.

## Окружение (важно)

- На этом Mac в PATH стоит pnpm 8.15.4, а проект требует 10.11.1 (lockfile v9). Запускать так: `corepack pnpm@10.11.1 <команда>` или исправить PATH. Старый pnpm 8 при `install` сносит `node_modules`.
- В shell Desktop Commander выставлен `NODE_ENV=production`: тесты падают с `React.act is not a function`. Запускать `NODE_ENV=test corepack pnpm@10.11.1 test`.

## Как работаем

1. Одна задача (D##) за сессию. Задача маленькая, с проверяемым критерием «Готово».
2. После задачи: отметить `[x]`, добавить строку в «Журнал» внизу, прогнать `pnpm typecheck && pnpm lint && pnpm test` (если менялся код).
3. Если задача не влезла в сессию, разбить её и записать остаток под тем же номером.
4. Новых компонентов и новых фич до конца Фазы 2 не добавляем.

Следующая задача: **D08b**

---

## Фаза 0. Публикация пакета

Цель: пакет можно поставить в чистый Next.js и он работает.

- [x] **D00. Git.** `git init`, baseline-коммит (сделано 2026-11-08); remote на GitHub добавить позже.
- [x] **D01. Путь к типам и мусор в dist.**
  `vite.config.ts`: в `dts()` добавить `entryRoot: 'src'` и исключить `src/test/**`, `**/*.test.*`, `**/*.stories.*`.
  Готово: после `pnpm build` есть `dist/index.d.ts`, нет `dist/src/test`, нет `*.test.d.ts` и `*.stories.d.ts`.
- [x] **D02. Директива `'use client'` в бандле.**
  Сохранить директиву в `dist/index.js` и `dist/index.cjs` (плагин preserve-directives или banner в Rollup).
  Готово: первая строка `dist/index.js` содержит `'use client'`.
- [x] **D03. Чистка зависимостей.**
  `@sloi/lit-wrappers` убрать из `dependencies`; `@sloi/headless-core` и `@sloi/tokens` проверить (вшиты в бандл → `devDependencies`); решить по `clsx`, `lucide-react`, `react-day-picker` (external + dependencies или вшить и убрать из dependencies).
  Готово: `pnpm pack` проходит, в `package.json` нет `workspace:*` в `dependencies`.
  Итог: `dependencies` = только `lucide-react` и `radix-ui` (external); `clsx`, `react-day-picker` (его CSS уходит в `style.css`) и `@sloi/*` вшиты и лежат в `devDependencies`.
- [x] **D04. publint и arethetypeswrong.**
  Запустить `npx publint` и `npx @arethetypeswrong/cli --pack .`, исправить замечания.
  Заодно исправить TS2742 в `primitives/menubar/menubar.tsx` (`MenubarMenu` без явного типа → непереносимый inferred type).
  Готово: оба инструмента без ошибок, при `pnpm build` нет TS-ошибок от dts.
- [x] **D05. Smoke-тест в чистом Next.js.**
  Создать приложение вне репозитория, поставить tarball из `pnpm pack`, отрендерить `Button` и `Select` в Server Component-странице с клиентским импортом.
  Готово: `next build` проходит без ошибок и предупреждений про директивы.

## Фаза 1. Реальный потребитель и зависимости

- [x] **D06. Реальное приложение.** Превратить smoke-приложение из D05 (`/Users/sem/WebstormProjects/sloi-smoke`, Next 16 + React 19; tarball брать не из /tmp, а копировать в папку приложения) в небольшой настоящий проект (форма + таблица на `DataTableV2`), оставить вне репозитория.
- [x] **D07. Честный фидбек.** Записать всё, что неудобно, в `docs/adoption/pain-points.md` (заменить выдуманные `AD-FB-*`). Готово: минимум 5 реальных пунктов с примерами кода.
  Уже найдено в D06 (проверено в `sloi-smoke`):
  1. `DataTable`/`DataTableV2` требуют `T extends Record<string, unknown>`: строки, объявленные как `interface`, не проходят (нужно `type`). Ослабить ограничение до `object`.
  2. Нет единого `Field` (Label + Input + FieldMessage + aria-describedby собираются руками); при этом есть и `FieldMessage`, и `FormMessage` из Radix Form: два пути для одного и того же.
  3. Типы V2 (колонки, сортировка, selection) отдельными именами не экспортируются (в d.ts это `*_2`), достаются только через `DataTableV2Props<T>[...]`.
  4. Не проверено руками в браузере: открытие Select, сортировка, выбор строк, пагинация (см. запись в журнале D06).
- [x] **D08. Зависимости, часть 1 (безопасные обновления).** `pnpm outdated` показал большие разрывы. Обновлено то, что не требует новой версии Node: `@testing-library/react` 16.3.3, `user-event` 14.6.9, `@types/react(-dom)` 19.3.0, `typescript-eslint` 8.72.2. Quality gate зелёный.
  Заблокировано (причины проверены по `engines`/`peerDependencies`):
  - Vite 8 требует Node `^20.19 || >=22.12`, Vitest 5 это `>=22.12`, jsdom 31 это `>=22.22`; в shell Desktop Commander Node 20.10.0.
  - `@vitejs/plugin-react` 6 работает только с Vite 8.
  - TypeScript 7 не пройдёт: `typescript-eslint` допускает TS `<6.1`. Остаёмся на 5.9.3.
- [ ] **D08b. Node 24 LTS.** `nvm install 24`, `.nvmrc`, `engines.node` в корневом `package.json`, `node-version` в CI. Готово: `node -v` в проекте ≥ 22.12, gate зелёный.
- [ ] **D08c. Сборочный стек.** После D08b: Vite 8, Vitest 5 (+ `@vitest/coverage-v8`), `@vitejs/plugin-react` 6, jsdom 31, `vite-plugin-dts` 5 (проверить `rollupTypes`), `@types/node`. По одному пакету за раз, gate после каждого.
- [ ] **D08d. Perf-тест вынести из общего прогона.** `data-table-v2.perf.test.tsx` измеряет FPS по часам и падает при параллельной нагрузке (48.2 < 50), отдельно проходит 3/3. Отдельный скрипт `test:perf` и запуск вне `pnpm test`.
- [ ] **D09. Зависимости, часть 2.** Обновить Storybook (проверить миграционный гайд), `pnpm storybook:build` проходит.
- [ ] **D10. Зависимости, часть 3.** Обновить ESLint-плагины, `radix-ui`, `react-day-picker`, `lucide-react`. Проверить changelog Radix на изменения `unstable_*`.

## Фаза 2. Качество компонентов

- [ ] **D11. Combobox: структура ARIA.** Убрать промежуточный `li` между `listbox` и `option` (или поставить `role="presentation"`). Добавить `aria-haspopup="listbox"`.
- [ ] **D12. Combobox: a11y-тест в открытом состоянии.** Тест открывает список и прогоняет axe. Готово: тест падает на старом коде и проходит на новом.
- [ ] **D13. Tooltip: один Provider.** Убрать `TooltipProvider` из `Tooltip`, добавить общий Provider и документировать его в Storybook. Решить, как не ломать API (опциональный Provider или внутренний fallback).
- [ ] **D14. Select: controlled/uncontrolled.** Проверить переход при отсутствии `defaultValue`; тест на предупреждение в консоли; исправить, если воспроизводится.
- [ ] **D15. Pagination: тесты логики.** Диапазоны страниц, границы, смена размера страницы, controlled/uncontrolled.
- [ ] **D16. Pagination: тексты и Select.** Вынести строки в props (`labels`), заменить нативный `<select>` на `Select` из библиотеки.
- [ ] **D17. Modal: unit + a11y тесты.**
- [ ] **D18. Table и Textarea: тесты.**
- [ ] **D19. NumberField и PhoneField: тесты.**
- [ ] **D20. SearchInput и FilterBar: тесты.**
- [ ] **D21. Button: `loading`.** Состояние загрузки с `aria-busy`, блокировкой клика и stories.
- [ ] **D22. Button: `danger` и слоты иконок.** Варианты и `startIcon`/`endIcon`, тесты, stories.
- [ ] **D23. Иконки вместо глифов.** Заменить текстовые "▾", "✓", "▴" в `primitives/_internal/common` на `Icon` из библиотеки.
- [ ] **D24. `unstable_*` в публичном API.** `OneTimePasswordField` и `PasswordToggleField` пометить experimental в JSDoc и stories или убрать из экспорта; записать решение в CHANGELOG.

### Фаза 2b. Задачи из D07 (делать сразу после Фазы 1, перед D11)

Подробности и примеры кода: `docs/adoption/pain-points.md`.

- [ ] **D38. Поля ввода: `box-sizing: border-box` (P1).** Input, Textarea, SearchInput, NumberField, PhoneField. Story «в узком контейнере». Готово: поле не вылезает за Card без внешнего reset.
- [ ] **D39. `DataTable`/`DataTableV2`: `T extends object` (P3).** Тест со строками-`interface`; экспортировать V2-типы под своими именами (P7).
- [ ] **D40. Компонент `Field` (P2, P4).** Label + control + hint + message, сам проставляет `id` и `aria-describedby`/`aria-invalid`; `SelectTrigger` с `fullWidth`; решить судьбу `FormMessage`.
- [ ] **D41. Base-слой или документация подключения (P5).** `base.css` (reset + font-family из токенов) либо раздел README; проверить в `sloi-smoke` без собственных глобальных стилей.

## Фаза 3. Дизайн-система как система

- [ ] **D25. Аудит токенов.** Прочитать `colors.css` и `palette.css`, составить список семантических токенов, которым нужна тёмная версия.
- [ ] **D26. Тёмная тема: токены.** `[data-theme="dark"]` (и `prefers-color-scheme`) в `@sloi/tokens`.
- [ ] **D27. Storybook: переключатель темы.** Подключить токены из `@sloi/tokens` вместо compat-слоя `src/app/styles`.
- [ ] **D28. Тёмная тема: Tier-1.** Пройти все 12 Tier-1 компонентов в тёмной теме, исправить контрасты.
- [ ] **D29. Решение по подпутям экспорта.** Короткий документ: какие подпути (`/button`, `/data-table-v2`), что с CSS.
- [ ] **D30. Подпути экспорта.** Реализация для `DataTableV2` и тяжёлых компонентов; проверка размеров бандла.
- [ ] **D31. Changesets.** Настроить версионирование и генерацию changelog.
- [ ] **D32. Визуальные регрессии: настройка.** Playwright или Chromatic, один компонент как пример.
- [ ] **D33. Визуальные регрессии: Tier-1.** Базовые снимки для 12 компонентов в обеих темах.

## Фаза 4. Упрощение процессов

- [ ] **D34. `CONTRIBUTING.md`.** Свести DoD, semver и правила в один документ.
- [ ] **D35. Актуализировать `UI_KIT_RULES.md`.** Источник токенов теперь `packages/tokens`; убрать вымышленных owners и лишний `CODEOWNERS`.
- [ ] **D36. Заморозить мультифреймворк.** `lit-wrappers` и MF-гейт пометить как исследование; убрать «Adoption-proven» и завышенные статусы из старого плана.
- [ ] **D37. Релиз.** Решение: публикация в npm или GitHub Packages, релиз `1.1.0` через Changesets.

---

## Журнал

| Дата | Задача | Результат / заметки |
| --- | --- | --- |
| 2026-11-08 | — | План создан |
| 2026-11-08 | D00 | git init + baseline-коммит `2037437` |
| 2026-11-08 | D01 | `entryRoot: 'src'` + исключения в dts; `dist/index.d.ts` на месте, тестовых d.ts нет |
| 2026-11-08 | D02 | плагин `preserveUseClient` в vite.config.ts; `"use client"` первой строкой в ESM и CJS |
| 2026-11-08 | D03 | deps: из `dependencies` убраны `@sloi/*`, `clsx`, `react-day-picker`; `lucide-react` теперь external; `index.js` 271→242 КБ; `pnpm pack` без `workspace:*`. Случайно снёс `node_modules` pnpm 8, восстановил из lockfile (162 теста зелёные при NODE_ENV=test) |
| 2026-11-08 | D04 | publint и attw чистые. `rollupTypes: true` (один `dist/index.d.ts` + копия `index.d.cts`), `exports` разделён на import/require с типами, `engines.node >=18`. Типы больше не ссылаются на `@sloi/headless-core` и `react-day-picker` (`ComboboxOption` и `DatePickerDateRange` объявлены локально). TS2742 в menubar исправлен |
| 2026-11-08 | D05 | Smoke-приложение `~/WebstormProjects/sloi-smoke` (Next 16.4.6, React 19.3.1, TS 7.0.2) ставит tarball; `next build` без ошибок и предупреждений; Button/Card/Badge в Server Component, Select в клиентском; типы реальные (ошибки на неверных props). **Фаза 0 завершена** |
| 2026-11-08 | D06 | `sloi-smoke` превращён в форму (Input, Textarea, Select, Label, FieldMessage, Button) + `DataTableV2` (сортировка, пагинация, выбор строк); `tsc` и `next build` чистые, SSR отдаёт таблицу. Найдены 3 проблемы API (см. D07). Ручной проход в браузере (`pnpm dev`) ждёт результата от владельца |
| 2026-11-10 | D07 | `docs/adoption/pain-points.md` (9 пунктов, из них 3 серьёзных: поля вылезают из контейнера, Label/Select в одной строке, таблица не принимает `interface`). В план добавлены D38–D41 |
| 2026-11-10 | D08 | Безопасные обновления (testing-library, @types/react, typescript-eslint). Vite 8 / Vitest 5 / jsdom 31 заблокированы версией Node (shell: 20.10.0), TS 7 заблокирован typescript-eslint. Найден флакующий perf-тест. Добавлены D08b-d |
