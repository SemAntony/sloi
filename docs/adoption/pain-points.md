# Pain points из реального использования

Источник: приложение `sloi-smoke` (Next 16, React 19, пакет из `pnpm pack`), 2026-11-10.
Заменяет выдуманные `AD-FB-*`. Серьёзность: **H** = баг/блокер, **M** = заметное неудобство, **L** = мелочь.

## P1 (H). Input и Textarea вылезают за границы контейнера
Исправлено (D38): `box-sizing: border-box` на всех полях ввода, story `InNarrowContainer`, тест `field-box-sizing.test.tsx`.
`input.module.scss` и textarea задают `width: 100%`, но не задают `box-sizing: border-box`.
Без глобального reset у приложения поле шире родителя на ширину padding и border (на скриншоте торчит за край Card).
Компонент не должен зависеть от reset приложения.
Исправление: `box-sizing: border-box` на всех полях ввода; story «в узком контейнере».

## P2 (H). Label и Select в одной форме ведут себя по-разному
Исправлено (D40): `Field` выстраивает label и поле в колонку (Select тоже на всю ширину), у `SelectTrigger` есть `fullWidth`; story `MixedForm`.
`Label` это `display: inline-flex`, `SelectTrigger` это `inline-flex` с `min-width: 11rem`.
`Input` (width 100%) уходит под label, а `SelectTrigger` встаёт в ту же строку и наезжает на подпись «Role» (скриншот).
Select ещё и не растягивается на всю ширину, как Input.
Исправление: общий компонент `Field` (см. P4), у `SelectTrigger` вариант/проп `fullWidth`.

## P3 (H). DataTable не принимает строки, объявленные как `interface`
Исправлено (D39): `T extends object`, тест `data-table-row-types.test.tsx`.
```ts
interface Row { id: number; name: string }
<DataTableV2 data={rows} columns={cols} rowKey="id" />
// TS2322: Type 'Row' is not assignable to type 'Record<string, unknown>'.
//         Index signature for type 'string' is missing in type 'Row'.
```
Ограничение `T extends Record<string, unknown>` слишком жёсткое. Исправление: `T extends object`, тест с `interface`.

## P4 (M). Нет единого Field, а сообщений два
Исправлено (D40): `Field` с `label`/`hint`/`error`; `FormMessage` оставлен только для нативной валидации Radix Form (см. JSDoc).
Label, Input, FieldMessage и `aria-describedby` собираются руками (id, htmlFor, связь с ошибкой).
При этом есть и `FieldMessage`, и `FormMessage` (Radix Form): два пути для одного и того же.
Исправление: `Field` (label + control + hint + message, сам проставляет id и aria-*); решить судьбу `FormMessage`.

## P5 (M). styles.css не задаёт базовую типографику и reset
В `dist/style.css` только два `font-family: inherit`; шрифт не задан нигде, поэтому в приложении без своих глобальных стилей всё рисуется Times (скриншот).
Ни README, ни Storybook этого не оговаривают.
Исправление: отдельный необязательный слой (например `@sloi/ui-kit/base.css`: reset + font-family из токенов) либо явная секция «Подключение» в README.

## P6 (M). Pagination: английские строки и нативный select
«Prev», «Next», «Rows», «Showing 1-4 of 4» зашиты в код; выбор размера страницы это нативный `<select>` с другим шрифтом и стрелкой, чем у `Select` библиотеки (скриншот).
Исправление: проп `labels`, замена на `Select` (задачи D16 в плане).

## P7 (L). Типы V2 таблицы не экспортируются под своими именами
Исправлено (D39): экспортируются `DataTableV2Column`, `DataTableV2SortState` и остальные (см. `data-table-v2/index.ts`).
В `d.ts` это `DataTableColumn_2`, `DataTableSortState_2` и т.д.; доступны только через `DataTableV2Props<T>['columns']`.
Исправление: экспортировать V2-типы явно (`DataTableV2Column`, `DataTableV2SortState`, ...).

## P8 (L, проверить). Индикатор сортировки это текстовый глиф «↕»
Выглядит как шрифтовой символ, а не как иконка библиотеки; в других шрифтах будет отличаться.

## P9 (L, проверить). Focus ring у SelectTrigger остаётся виден после выбора
На скриншоте у триггера толстая синяя рамка. Нужно убедиться, что это `:focus-visible`, а не `:focus`.

## P10 (M). Pagination: подпись `<nav>` зашита в код
`<nav aria-label='Pagination'>` нельзя переопределить: две пагинации на странице дают повторяющиеся landmark'и (axe `landmark-unique`), а локализовать подпись нельзя.
Исправлено: проп `navigationLabel` (по умолчанию 'Pagination'), в `DataTable` проп `paginationLabel`. Осталось проверить `DataTableV2`.

## P11 (L). `FormValidityState` с `name` вне `FormField` падает
В Radix Form 0.1.8 `FormValidityState` всегда читает контекст поля, поэтому проп `name` вне `FormField` не работает (ошибка «must be used within FormField»); story ValidityState была сломана. Исправлено в story (блок перенесён внутрь поля). Стоит либо закрыть проп `name` в обёртке, либо документировать.

## P12 (L). Progress не имеет имени по умолчанию
`Progress` (Radix) не получает accessible name: потребитель обязан передавать `aria-label`/`aria-labelledby`. Story исправлены; в документации компонента отметить как обязательное.

