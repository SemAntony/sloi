import {
  Button,
  Combobox,
  Dialog,
  Select,
  Tabs,
  Tooltip,
  type DialogProps,
  type SelectProps
} from '@sloi/ui-kit';
import {
  useComboboxController,
  useDialogController,
  useSelectController,
  useTabsController,
  useTooltipController,
  type ComboboxOption,
  type DialogControllerOptions,
  type SelectControllerOptions
} from '@sloi/headless-core';
import { LIT_WRAPPER_SCOPE, litWrapperStatus, type LitWrapperComponent } from '@sloi/lit-wrappers';

const dialogProps: DialogProps = {};
const selectProps: SelectProps = {};
const dialogOptions: DialogControllerOptions = { defaultOpen: true };
const selectOptions: SelectControllerOptions = { defaultOpen: false, defaultValue: 'alpha' };
const comboboxOptions: ComboboxOption[] = [{ value: 'alpha', label: 'Alpha' }];
const litComponent: LitWrapperComponent = LIT_WRAPPER_SCOPE[0];

void Button;
void Dialog;
void Select;
void Tabs;
void Tooltip;
void Combobox;
void dialogProps;
void selectProps;
void dialogOptions;
void selectOptions;
void comboboxOptions;
void litComponent;
void litWrapperStatus;
void useDialogController;
void useSelectController;
void useTabsController;
void useTooltipController;
void useComboboxController;
