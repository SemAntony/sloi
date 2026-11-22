'use client';

import '@sloi/tokens/css/styles.css';

import { DataTableV2 as DataTableV2Component } from './shared/ui/data-table-v2';
import { DatePicker as DatePickerComponent } from './shared/ui/date-picker';

export * from './shared/ui';

// Heavy-компоненты живут в своих подпутях (docs/architecture/EXPORT-SUBPATHS.md).
// Явный экспорт имеет приоритет над `export *` выше. Значение то же самое, но
// `@deprecated` стоит только на корневом имени, а не на исходном компоненте.
// Шаг B (следующий major) уберёт эти два экспорта из корня.

/** @deprecated Импортируйте из `@sloi/ui-kit/date-picker`. Экспорт из корня будет удалён в следующем major. */
export const DatePicker = DatePickerComponent;

/** @deprecated Импортируйте из `@sloi/ui-kit/data-table-v2`. Экспорт из корня будет удалён в следующем major. */
export const DataTableV2 = DataTableV2Component;
