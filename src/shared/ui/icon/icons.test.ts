import { describe, expect, it } from 'vitest';
import {
  ICON_LIBRARY,
  ICON_LIBRARY_CATEGORIES,
  ICON_LIBRARY_COUNT,
  IconSearch
} from './icons';

describe('Icon curated library', () => {
  it('ships a practical baseline set of icons', () => {
    expect(ICON_LIBRARY_COUNT).toBeGreaterThanOrEqual(60);
    expect(ICON_LIBRARY_COUNT).toBeLessThanOrEqual(90);
  });

  it('keeps icon names unique across categories', () => {
    const names = ICON_LIBRARY_CATEGORIES.flatMap((category) =>
      ICON_LIBRARY[category].map((entry) => entry.name)
    );
    expect(new Set(names).size).toBe(names.length);
  });

  it('exposes icon aliases for consumer imports', () => {
    expect(IconSearch).toBeDefined();
  });
});
