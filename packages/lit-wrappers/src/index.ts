export const LIT_WRAPPER_SCOPE = [
  'Dialog',
  'Select',
  'Tooltip',
  'Tabs',
  'Combobox'
] as const;

export type LitWrapperComponent = (typeof LIT_WRAPPER_SCOPE)[number];
export type LitWrapperStatus = 'planned' | 'in-progress' | 'validated';

export const litWrapperStatus: Record<LitWrapperComponent, LitWrapperStatus> = {
  Dialog: 'planned',
  Select: 'planned',
  Tooltip: 'planned',
  Tabs: 'planned',
  Combobox: 'planned'
};

export const LIT_WRAPPERS_STAGE = 'scaffold' as const;
