# ROADMAP: sloi-ui (план «по задаче в день»)

Создан: 2026-11-08. Рабочий план после паузы (последняя активность ~2026-04-06).
Старый `docs/backlog/design-system-execution-plan.md` считается завершённым; вся новая работа идёт здесь.

## Принципы Sloi UI (зафиксировано 2026-11-12)

1. **React-first, cross-platform-ready.** Сначала качественный React-продукт, но без решений, блокирующих другие платформы.
2. **Tokens-first.** Единый источник токенов (DTCG), платформенные форматы генерируются из него.
3. **Accessibility by design.** Доступность это критерий готовности компонента, а не улучшение «потом».
4. **Reuse proven behavior.** Не писать свои механизмы там, где зрелые решения (Radix, React Aria, Zag.js) уже закрывают задачу.
5. **Incremental architecture.** Архитектура растёт вместе с реальными потребностями; без заготовок под ненаписанные платформы.
6. **Product before monetization.** Сначала сильные компоненты, таблицы, формы, админские паттерны и удобство интеграции; лицензия и тарифы позже.

Позиционирование: пока это **React design system с кросс-платформенным архитектурным направлением**. Называть её cross-platform можно только после первой проверенной второй реализации (A8).

## Окружение (важно)

- ВАЖНО: любая команда «голым» `pnpm` в терминале запускает pnpm 8.15.4 (из /usr/local/bin), который не понимает lockfile v9 и пересоздаёт/опустошает `node_modules`. Лечение: `corepack enable` (тогда `pnpm` возьмёт версию из `packageManager`) или всегда `corepack pnpm@10.11.1 ...`. Если `node_modules` оказался пустым: `NODE_ENV=development corepack pnpm@10.11.1 install --frozen-lockfile`.
- На этом Mac в PATH стоит pnpm 8.15.4, а проект требует 10.11.1 (lockfile v9). Запускать так: `corepack pnpm@10.11.1 <команда>` или исправить PATH. Старый pnpm 8 при `install` сносит `node_modules`.
- В shell Desktop Commander выставлен `NODE_ENV=production`: тесты падают с `React.act is not a function`. Запускать `NODE_ENV=test corepack pnpm@10.11.1 test`.

- Для моих команд из чата нужно явно ставить Node 24: `export PATH="$HOME/.nvm/versions/node/v24.22.2/bin:$PATH"`.

## Как работаем

1. Одна задача (D##) за сессию. Задача маленькая, с проверяемым критерием «Готово».
2. После задачи: отметить `[x]`, добавить строку в «Журнал» внизу, прогнать `pnpm typecheck && pnpm lint && pnpm test` (если менялся код).
3. Если задача не влезла в сессию, разбить её и записать остаток под тем же номером.
4. Новых компонентов и новых фич до конца Фазы 2 не добавляем.

Следующая задача: **D41** (Фаза 2b, base-слой или документация подключения) (Фаза 1 закончена; группа 1 Фазы 5 сделана: A1, A3, A2)

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
- [x] **D08b. Node 24 LTS.** `nvm install 24`, `.nvmrc`, `engines.node` в корневом `package.json`, `node-version` в CI. Готово: `node -v` в проекте ≥ 22.12, gate зелёный.
  Сделано: Node 24.22.2 (nvm), `.nvmrc` = 24, CI `node-version: 24`. `engines.node` в `package.json` оставлен `>=18`: это требование к потребителям пакета, а не к разработке.
- [x] **D08c. Сборочный стек (частично, до пределов Storybook 8).**
  Сделано: `vite-plugin-dts` 5.1.2 (опция `rollupTypes` стала `bundleTypes`, `@microsoft/api-extractor` теперь нужно ставить явно; `d.ts` совпадает с прежним с точностью до пробелов), Vite 6.4.6 (в Vite 6 CSS библиотеки получил имя `ui-kit.css`, вернули `style.css` через `build.lib.cssFileName: 'style'`), Vitest 5.1.0, `@vitest/coverage-v8` 5.1.0, jsdom 31.0.0. Gate зелёный: 162 теста, 34 a11y-теста, `publint`/`attw` чистые, `storybook:build` проходит.
  Остаётся (перенесено в D09): Vite 7/8 и `@vitejs/plugin-react` 6 заблокированы Storybook 8.6 (его peer: Vite `<=6`). Сначала Storybook 10, потом Vite 8.
- [x] **D08d. Perf-тест вынести из общего прогона.** `data-table-v2.perf.test.tsx` измеряет FPS по часам и падает при параллельной нагрузке (48.2 < 50), отдельно проходит 3/3. Отдельный скрипт `test:perf` и запуск вне `pnpm test`.
  Сделано: `vitest.perf.config.ts` (без параллелизма файлов), perf-тест исключён из `vitest.config.ts`; `pnpm test` теперь 42 файла/161 тест, `pnpm test:perf` 1/1. В CI не подключён намеренно (общие раннеры флакают так же): запускать локально перед релизом.
- [x] **D09. Зависимости, часть 2: Storybook 10.** Storybook 8.6 → 10.6.7 (`storybook`, `@storybook/react`, `react-vite`, `addon-a11y`, новый `addon-docs`). `addon-essentials` и `@storybook/test` удалены (встроены в ядро); импорты `@storybook/test` → `storybook/test` в 13 файлах; `main.ts`: `addons: ['@storybook/addon-docs', '@storybook/addon-a11y']`. Результат: `storybook:build` проходит, 293 записи (230 stories + 63 docs), typecheck, lint, 161 тест зелёные.
- [x] **D09b. Vite 8 + `@vitejs/plugin-react` 6.** Vite 8.3.8, plugin-react 6.3.0. Vite 8 (Rolldown) сам сохраняет `'use client'`, поэтому мой плагин `preserveUseClient` удалён (иначе директива дублировалась). `cssFileName`, `bundleTypes`, `external` работают без изменений; `d.ts` совпадает с прежним. Gate: 161 + 34 теста, typecheck, lint, publint, attw, `storybook:build` (293 записи) и smoke в `sloi-smoke` (`next build` + `tsc`) зелёные. Бандл: `index.js` 244→229 КБ, `style.css` 117→116 КБ.
- [x] **D10. Зависимости, часть 3: runtime и React.** `radix-ui` 1.4.3→1.8.1, `lucide-react` 1.7→1.72, dev `react`/`react-dom` 19.3.1, `sass` 1.108. Пришлось поправить: `Slottable` (новые типы Radix, `utilities.tsx`) и story `PasswordToggleField`: в Radix unstable API проп переименован `onVisiblityChange` → `onVisibilityChange` (внимание: при обновлении `radix-ui` у потребителей это ломающее изменение; записать в CHANGELOG, см. D24). Если после `pnpm update` падают тесты с «Invalid hook call»: в `node_modules` осталось две копии React; помогает чистая переустановка (`rm -rf node_modules && pnpm install --frozen-lockfile`). Gate зелёный: 161 + 34 теста, 229 stories (strict), perf, typecheck, lint, publint, attw, storybook build.
- [x] **D10b. Линтер.** `eslint` 10.14, `@eslint/js` 10, `eslint-plugin-react-hooks` 7.1.1, `eslint-plugin-react-refresh` 0.5.7, `globals` 17. Совместимость по peer проверена заранее. Результат: 15 новых замечаний. Исправлено 7: `no-useless-assignment` в `data-table(-v2)` (`let compareResult: number`), story `toast` (ref → state), две stories с имитацией серверного запроса (`eslint-disable-next-line` с причиной). Остальные 8 (новые правила React Compiler `set-state-in-effect` и `refs` в `data-table-v2.tsx`, `data-table.tsx`, `headless-core/combobox.ts`) оставлены предупреждениями через override в `eslint.config.js` и вынесены в D10e. Gate зелёный: 0 ошибок линтера.
- [ ] **D10e. Рефакторинг эффектов (8 предупреждений линтера).** `DataTableV2` (восстановление состояния из storage, нормализация pinned/column sizes, сброс виртуального скролла, чтение ref во время рендера), `DataTable` (восстановление состояния), `useComboboxController` (сброс `activeIndex`). Варианты: derived state, `key`-сброс, обработчики вместо эффектов. Критерий: override в `eslint.config.js` удалён, тесты и perf-тест зелёные. Делать вместе с Фазой 2 (тесты на DataTable).
- [x] **D10c. Остальное.** `@testing-library/jest-dom` 6.9→7.0.1, `react-day-picker` 9.14→10.0.2 (вшит в бандл: DatePicker-тесты, 80 классов `rdp-*` в `style.css`, `index.js` 229→231 КБ, `style.css` 116→115.5 КБ). `@types/node` оставлен на 24.x (соответствует Node 24; 26.x не нужен). Исправлено: в `input.stories.tsx` аргумент `type: {}` (мусор, новые типы React его не принимают). Gate, smoke-приложение, `publint`/`attw`, storybook зелёные. Руками DatePicker в браузере не смотрел: открой story DatePicker и проверь календарь визуально.

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
- [ ] **D42. RTL: аудит физических свойств.** Найти `left`/`right`, `margin-left`/`padding-right`, `text-align: left`, `translateX` и стрелки-иконки в `*.module.scss` и компонентах; заменить на логические (`inline-start/end`, `margin-inline`) там, где это безопасно. Одна story в `dir="rtl"` для Tier-1. Готово: список найденного в `docs/adoption/rtl-audit.md`, исправления для Tier-1, остальное записано как остаток.
- [ ] **D24. `unstable_*` в публичном API.** `OneTimePasswordField` и `PasswordToggleField` пометить experimental в JSDoc и stories или убрать из экспорта; записать решение в CHANGELOG.

### Фаза 2b. Задачи из D07 (делать сразу после Фазы 1, перед D11)

Подробности и примеры кода: `docs/adoption/pain-points.md`.

- [x] **D38. Поля ввода: `box-sizing: border-box` (P1).** Input, Textarea, SearchInput, NumberField, PhoneField. Story «в узком контейнере». Готово: поле не вылезает за Card без внешнего reset.
- [x] **D39. `DataTable`/`DataTableV2`: `T extends object` (P3).** Тест со строками-`interface`; экспортировать V2-типы под своими именами (P7).
- [x] **D40. Компонент `Field` (P2, P4).** Label + control + hint + message, сам проставляет `id` и `aria-describedby`/`aria-invalid`; `SelectTrigger` с `fullWidth`; решить судьбу `FormMessage`.
- [ ] **D41. Base-слой или документация подключения (P5).** `base.css` (reset + font-family из токенов) либо раздел README; проверить в `sloi-smoke` без собственных глобальных стилей.

## Фаза 3. Дизайн-система как система

- [ ] **D25. Аудит тёмной темы (таблица контраста готова: A3; осталось: градиенты и stories с сырой палитрой).** Тёмная тема в токенах УЖЕ есть (`packages/tokens/src/colors.css`, `[data-theme='dark']`; раньше я ошибочно считал, что её нет). Задача: сверить, что у каждого семантического токена светлой темы есть тёмный аналог, и посчитать контраст пар text/surface и status (AA 4.5:1) обеих тем. Результат: таблица с провалами.
  Отдельно проверить места с градиентами (axe не считает контраст по градиенту): `button.module.scss` (primary), `progress`, `skeleton`; и stories с «сырыми» палитровыми цветами (`context-menu`, `aspect-ratio` stories), которые не адаптируются к тёмной теме.
- [ ] **D26. Тёмная тема: исправить найденное в D25.** Только токены/компоненты, которые провалили контраст или не имеют тёмного значения.
- [ ] **D27. Storybook: переключатель темы.** Тулбар light/dark (ставит `data-theme` на `<html>`/обёртку) и токены из `@sloi/tokens` вместо compat-слоя `src/app/styles`.
- [ ] **D28. Тёмная тема: Tier-1.** Пройти 12 Tier-1 компонентов в тёмной теме (a11y-панель + глазами), исправить.
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

## Фаза 5. Архитектурный фундамент (React-first, cross-platform-ready)

Зависимости: группа 1 идёт сразу после Фазы 1; группа 2 после стабилизации React (Фазы 2–3); группа 3 только при реальной потребности.
Не делаем сейчас: перестройку monorepo под будущие платформы, универсальный state-пакет, переписывание React-компонентов, component tokens для всех компонентов сразу, Figma-плагин, RFC на решения без спора, генерацию Swift/Kotlin.

### Группа 1: сразу после Фазы 1

- [x] **A1. Vision & Principles.** Один документ `docs/architecture/VISION.md`: назначение, принципы (см. выше), позиционирование, платформенная стратегия. Черновик пишет Claude, правит владелец.
- [x] **A3. Проверка контраста по токенам.** (Идёт раньше A2: работает с текущим CSS и сразу закрывает D25.)
  Технический план:
  1. Скрипт `packages/tokens/scripts/check-contrast.mjs`: собирает карту токенов по темам (`:root` и `[data-theme='dark']`, 44 dark-переопределения), раскрывает `var(--…)`-алиасы до hex.
  2. Список пар лежит в явном конфиге (`contrast-pairs.json`) с обоснованием: текст на фоне, текст на поверхностях, текст на интерактивных/статусных фонах (`text-on-primary` на `interactive-primary-bg`, `text-on-danger` на danger), границы и индикаторы состояния, focus ring.
  3. Пороги WCAG 2.2 AA: 4.5:1 обычный текст, 3:1 крупный текст, 3:1 значимые нетекстовые элементы (границы полей, focus, индикаторы). Disabled-состояния исключены, это указано в конфиге.
  4. Вывод: таблица тема / пара / значение / порог и конкретные ошибки («text-secondary на surface-default: 3.9:1 < 4.5:1»); код выхода ≠ 0 при провале. Список тем читается из данных, чтобы потом добавить High Contrast без правки скрипта.
  5. Подключить в `pnpm test` как vitest-тест (или отдельный скрипт `check:contrast`) и в CI.
  Готово: скрипт даёт отчёт по light и dark; все провалы либо исправлены (D26), либо явно перечислены.
  Сделано: `check-contrast.mjs` + `contrast-pairs.json` (59 пар на тему, темы читаются из CSS), тест `src/test/token-contrast.test.ts` (входит в `pnpm test`, отдельный CI-шаг не нужен), запуск `pnpm tokens:contrast`. 7 обязательных провалов записаны в `knownFailures` со ссылкой на D26 (если запись начинает проходить, проверка падает: baseline нельзя забыть).
- [x] **A2. Токены в DTCG.** (Источник истины меняется с CSS на JSON.)
  Технический план:
  1. **A2a. Разовая миграция.** Скрипт преобразует текущие CSS-токены в DTCG-файлы: `source/primitives/` (палитра, 242), `source/semantic/light.json`, `source/semantic/dark.json` (44 переопределения), spacing/radius/shadow/typography из `tokens.css` и `typography.css`. Алиасы становятся `{palette.slate.11}`. Типы: `color`, `dimension`, `fontFamily`, `fontWeight`, `shadow`, `duration`.
  2. **A2b. Сборка.** Style Dictionary генерирует CSS (те же имена `--sloi-*`, те же селекторы `:root` / `[data-theme='dark']`), TypeScript и JSON.
  3. **A2c. Тест эквивалентности.** Парсим объявления сгенерированного и текущего CSS в карты и сравниваем (должны совпасть, допускается только порядок/форматирование). Пока тест не зелёный, старый `sync-artifacts.mjs` остаётся.
  4. **A2d. Переключение.** Удалить regex-парсер (`sync-artifacts.mjs`, 83 строки), обновить `README` и скрипты, прогнать gate, smoke в `sloi-smoke` и stories.
  Формат вывода сейчас: только CSS и TypeScript/JSON.
  Готово: CSS-контракт `@sloi/tokens` не изменился, `tokens.json` в настоящем формате DTCG (`$value`/`$type`).
  Сделано: источник `packages/tokens/source/`, сборка `pnpm tokens:build` (Style Dictionary 5.8 загружает и проверяет ссылки, артефакты формирует `scripts/build-tokens.mjs`), тест `src/test/tokens-dtcg-equivalence.test.ts` (эквивалентность CSS и побайтовая свежесть `src/`). Решения: hex-строки, `color-mix`/`ease*` через `$extensions["sloi.css"]`, имя CSS = путь через дефис. `sync-artifacts.mjs` удалён. `scripts/migrate-css-to-dtcg.mjs` оставлен как носитель правил имён (`pathFor`); удалить после A4. Не проверено: smoke в `../sloi-smoke` (использует vendored tgz, нужен ручной `pnpm pack` и пересборка).

### Группа 2: после стабилизации React

- [ ] **A4. Component tokens для Button.** Третий слой токенов (`button.primary.background`, `button.radius`, ...) на одном компоненте; оценить, стоит ли распространять.
- [ ] **A5. Модель тем.** Переопределение semantic-токенов, High Contrast, Density (comfortable/compact), Brand-тема, `ThemeProvider` и системная тема; A3 проверяет каждую новую тему автоматически.
- [ ] **A6. Контракт Button.** API, состояния, варианты и таблица поддержки платформ (React: stable, остальные: planned/none).

### Группа 3: только при реальной потребности

- [ ] **A7. Оценка поведенческого ядра.** Не выбирать одну библиотеку на всё: сравнить Zag.js (state machines, независимы от фреймворка) и React Aria (поведение и a11y, привязаны к React) на конкретных компонентах (например DatePicker, Combobox); критерий: минимум дублирования при сохранении качества. Результат: короткий RFC.
- [ ] **A8. React Native: Button proof-of-concept.** Проверить переносимость токенов, API и поведения. Это не начало RN-библиотеки. Только после этого решать про нативные форматы токенов (Swift/Kotlin).

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
| 2026-11-10 | D08b | Node 24.22.2: typecheck, lint, 162 теста, build зелёные; добавлен `.nvmrc`, CI переведён на Node 24 |
| 2026-11-10 | D08c | dts 5, Vite 6.4, Vitest 5, jsdom 31: gate зелёный (162 + 34 a11y теста, publint, attw, storybook build). Vite 8 ждёт Storybook 10 (D09) |
| 2026-11-10 | D08d | perf-тест вынесен: `pnpm test` (161) без него, `pnpm test:perf` отдельно (проходит) |
| 2026-11-10 | D09 | Storybook 10.6.7: build зелёный (293 записи), @storybook/test → storybook/test, addon-essentials убран, addon-docs добавлен. Vite 8 вынесен в D09b |
| 2026-11-10 | fix | Story `Foundations/Colors`: заголовок «Dark» имел контраст 1.37:1 (наследовал тёмный цвет страницы). `color: var(--sloi-text-primary)` на `.themeCard` даёт ~14:1. Попутно выяснилось, что тёмная тема в токенах уже существует; D25–D28 переформулированы |
| 2026-11-10 | fix | Story `Foundations/Design System`: hero-градиент давал в axe «фон не определён» (needs review), а в тёмной теме реально контраст ~2.4:1 (светлые палитровые пятна под светлым текстом). Заменён на сплошной `color-mix(--sloi-focus-ring 12%, --sloi-surface-base)`: ≥11.8:1 в обеих темах. Компоненты используют семантические токены; сырую палитру используют только 2 story-файла |
| 2026-11-10 | D09b | Vite 8.3.8 + plugin-react 6.3.0; плагин 'use client' удалён (Rolldown сохраняет директиву сам); всё зелёное, smoke-приложение собирается с новым tarball |
| 2026-11-11 | D07b | Аудит a11y по всем stories: 18 нарушений → 0 (`test:stories-a11y`, в CI). Новые API: `Pagination.navigationLabel`, `DataTable.paginationLabel`. Проверить `DataTableV2` на то же |
| 2026-11-12 | D10 | radix-ui 1.8.1, lucide-react 1.72, react 19.3.1, sass 1.108; правки Slottable и PasswordToggleField (`onVisibilityChange`); node_modules один раз оказался пустым (вероятно, запуск pnpm 8), восстановлен frozen install |
| 2026-11-12 | plan | Добавлены принципы Sloi и Фаза 5 (A1–A8): токены в DTCG, проверка контраста по токенам, component tokens на Button, модель тем; RN и выбор ядра только при потребности. Порядок: D10b, D10c, A1, A3, A2 |
| 2026-11-12 | D10b | ESLint 10 + react-hooks 7 + refresh 0.5 + globals 17: исправлено 7 из 15 новых замечаний, 8 (эффекты в DataTable/Combobox) оставлены предупреждениями и вынесены в D10e |
| 2026-11-12 | D10c | jest-dom 7, react-day-picker 10 (вшит), мусорный `type: {}` в Input story убран; всё зелёное. **Фаза 1 закончена** |
| 2026-11-13 | A1 | Черновик `docs/architecture/VISION.md` (цель, позиционирование, 6 принципов «значит / не значит», слои и этапы платформ, чего не делаем, критерии решений, 4 открытых вопроса владельцу). Ждёт правки владельца |
| 2026-11-13 | A3 | `packages/tokens/scripts/check-contrast.mjs` + `contrast-pairs.json` + тест (171 тест зелёный, typecheck/lint без новых замечаний). Провалы: light: границы полей 1.43:1 и invalid 2.77:1; dark: белый текст на primary-кнопке 2.59:1 (hover 3.67:1), граница поля 1.40:1. Всё в knownFailures → D26. Advisory (не валят): разделители и рамки статусов |
| 2026-11-13 | plan | В VISION добавлены таблица ориентиров (Fluent, Carbon, Material 3, Polaris) и критерий RTL; в план добавлена D42 (аудит RTL). Перед A2 нужно решение по `color-mix`, формату цвета и именам токенов |
| 2026-11-13 | A2 | A2a-A2d: DTCG-источник (242 палитра, 47 foundation, 50 light, 44 dark), Style Dictionary 5.8, тест эквивалентности (мутации в source ловятся), `sync-artifacts.mjs` удалён. Gate: typecheck, lint (8 прежних warnings), test 176, test:a11y 34, storybook:build, build зелёные; adoption-метрики без изменений. Breaking для JS-потребителей `@sloi/tokens`: `TOKENS` теперь DTCG-дерево (раньше плоская карта `--sloi-*`), `PRIMITIVE_TOKENS`/`SEMANTIC_TOKENS` удалены; `TOKEN_SCHEMA_URL` сохранён |
| 2026-11-13 | D38 | `box-sizing: border-box` на Input, Textarea, PhoneField и на корне и внутреннем input у SearchInput и NumberField. Тест `src/test/field-box-sizing.test.tsx` (падает на старом SCSS: content-box, проходит на новом), story `InNarrowContainer` с проверкой выхода за границы в браузере. Gate: typecheck, lint (8 прежних warnings), test 178, test:a11y 34, storybook:build |
| 2026-11-13 | D39 | `T extends Record<string, unknown>` заменён на `T extends object` в DataTable и DataTableV2 (typecheck чистый без других правок). V2-типы экспортируются под своими именами: `DataTableV2Column`, `DataTableV2SortState`, `DataTableV2SelectionKey`, `DataTableV2ColumnId`, `DataTableV2ColumnVisibility`, `DataTableV2RowSelection`, `DataTableV2RowSelectionContext`; в `dist/index.d.ts` исчезли `*_2`. Тест `src/test/data-table-row-types.test.tsx` (строки-interface; на старом ограничении typecheck даёт TS2322/TS2344). Gate: typecheck, lint (8 прежних warnings), test 181, test:a11y 34, build |
| 2026-11-13 | D40 | Компонент `Field` (`src/shared/ui/field`): `label`, `hint`, `error`, `invalid`, `required`, `disabled`, `id`. Контекст `src/shared/lib/field/field-context.ts` + хук `useFieldControl`: Input, Textarea, PhoneField, SearchInput, NumberField и SelectTrigger сами получают `id`, `aria-describedby` (склеивается с явным), `aria-invalid`, `aria-required`, `disabled`; вне Field поведение не меняется. `id` принадлежит Field (иначе рвётся htmlFor). `SelectTrigger fullWidth` + стиль invalid. `FormMessage` оставлен для нативной валидации Radix Form, в JSDoc указано, что для остального предпочтителен `Field`. 16 тестов (unit + axe), stories (в т.ч. MixedForm и Validation с play), тег `experimental`. Gate: typecheck, lint (8 прежних), test 197, test:a11y 36, test:stories-a11y 237, storybook:build, build. Не охвачены Field: Combobox, DatePicker, Checkbox/Radio/Switch (контекст готов, подключается по одной строке) |
