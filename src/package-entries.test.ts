import { describe, expect, it } from 'vitest';

import * as root from './index';
import * as dataTableV2 from './data-table-v2';
import * as datePicker from './date-picker';

// Корневые DatePicker/DataTableV2 (@deprecated) обязаны оставаться тем же компонентом,
// что и в подпутях: иначе импорт из разных мест даст два разных типа в React-дереве.
describe('package entries', () => {
  it('root DatePicker is the same component as the date-picker subpath', () => {
    expect(root.DatePicker).toBe(datePicker.DatePicker);
  });

  it('root DataTableV2 is the same component as the data-table-v2 subpath', () => {
    expect(root.DataTableV2).toBe(dataTableV2.DataTableV2);
  });
});
