import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { useControllableState } from './use-controllable-state';

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
  keywords?: string[];
};

export type ComboboxControllerOptions = {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

export type ComboboxController = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeIndex: number;
  selectedValue: string | undefined;
  searchValue: string;
  filteredOptions: ComboboxOption[];
  commitValue: (value: string | undefined) => void;
  commitSearchValue: (value: string) => void;
  selectOption: (option: ComboboxOption) => void;
  clearValue: () => void;
  moveActiveIndex: (delta: number) => void;
  handleInputKeyDown: (
    event: KeyboardEvent<HTMLInputElement>,
    externalHandler?: (event: KeyboardEvent<HTMLInputElement>) => void
  ) => void;
  getActiveDescendantId: (listboxId: string) => string | undefined;
};

const clampIndex = (index: number, optionsLength: number) => {
  if (optionsLength <= 0) {
    return -1;
  }

  if (index < 0) {
    return optionsLength - 1;
  }

  if (index >= optionsLength) {
    return 0;
  }

  return index;
};

export const useComboboxController = ({
  options,
  value,
  defaultValue,
  onValueChange,
  searchValue,
  defaultSearchValue,
  onSearchValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled = false
}: ComboboxControllerOptions): ComboboxController => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedValue, setSelectedValue] = useControllableState<string | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange
  });

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue]
  );

  const [resolvedSearchValue, setResolvedSearchValue, isSearchControlled] = useControllableState<string>({
    prop: searchValue,
    defaultProp: defaultSearchValue ?? selectedOption?.label ?? '',
    onChange: onSearchValueChange
  });

  const [resolvedOpen, setResolvedOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange
  });

  useEffect(() => {
    if (!isSearchControlled && selectedOption && resolvedSearchValue !== selectedOption.label) {
      setResolvedSearchValue(selectedOption.label, { emitChange: false });
    }
  }, [isSearchControlled, resolvedSearchValue, selectedOption, setResolvedSearchValue]);

  const filteredOptions = useMemo(() => {
    const query = resolvedSearchValue.trim().toLowerCase();
    if (!query) {
      return options;
    }

    return options.filter((option) => {
      if (option.label.toLowerCase().includes(query)) {
        return true;
      }

      if (option.value.toLowerCase().includes(query)) {
        return true;
      }

      return (option.keywords ?? []).some((keyword) => keyword.toLowerCase().includes(query));
    });
  }, [options, resolvedSearchValue]);

  useEffect(() => {
    if (!resolvedOpen) {
      setActiveIndex(-1);
      return;
    }

    const firstEnabledIndex = filteredOptions.findIndex((option) => !option.disabled);
    setActiveIndex(firstEnabledIndex);
  }, [filteredOptions, resolvedOpen]);

  const commitValue = useCallback(
    (nextValue: string | undefined) => {
      setSelectedValue(nextValue);
    },
    [setSelectedValue]
  );

  const commitSearchValue = useCallback(
    (nextValue: string) => {
      setResolvedSearchValue(nextValue);
    },
    [setResolvedSearchValue]
  );

  const selectOption = useCallback(
    (option: ComboboxOption) => {
      if (option.disabled) {
        return;
      }

      commitValue(option.value);
      commitSearchValue(option.label);
      setResolvedOpen(false);
    },
    [commitSearchValue, commitValue, setResolvedOpen]
  );

  const clearValue = useCallback(() => {
    commitValue(undefined);
    commitSearchValue('');
    setResolvedOpen(false);
  }, [commitSearchValue, commitValue, setResolvedOpen]);

  const moveActiveIndex = useCallback(
    (delta: number) => {
      const enabledOptions = filteredOptions.filter((option) => !option.disabled);
      if (enabledOptions.length === 0) {
        return;
      }

      const currentValue = filteredOptions[activeIndex]?.value;
      const enabledIndex = enabledOptions.findIndex((option) => option.value === currentValue);
      const nextEnabledIndex = clampIndex(enabledIndex + delta, enabledOptions.length);
      const nextValue = enabledOptions[nextEnabledIndex]?.value;
      const nextIndex = filteredOptions.findIndex((option) => option.value === nextValue);
      setActiveIndex(nextIndex);
    },
    [activeIndex, filteredOptions]
  );

  const handleInputKeyDown = useCallback(
    (
      event: KeyboardEvent<HTMLInputElement>,
      externalHandler?: (event: KeyboardEvent<HTMLInputElement>) => void
    ) => {
      if (disabled) {
        externalHandler?.(event);
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!resolvedOpen) {
          setResolvedOpen(true);
        } else {
          moveActiveIndex(1);
        }
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!resolvedOpen) {
          setResolvedOpen(true);
        } else {
          moveActiveIndex(-1);
        }
      }

      if (event.key === 'Enter' && resolvedOpen && activeIndex >= 0) {
        event.preventDefault();
        const option = filteredOptions[activeIndex];
        if (option) {
          selectOption(option);
        }
      }

      if (event.key === 'Escape') {
        setResolvedOpen(false);
      }

      externalHandler?.(event);
    },
    [
      activeIndex,
      disabled,
      filteredOptions,
      moveActiveIndex,
      resolvedOpen,
      selectOption,
      setResolvedOpen
    ]
  );

  const getActiveDescendantId = useCallback(
    (listboxId: string) =>
      resolvedOpen && activeIndex >= 0 ? `${listboxId}-option-${filteredOptions[activeIndex]?.value}` : undefined,
    [activeIndex, filteredOptions, resolvedOpen]
  );

  return {
    open: resolvedOpen,
    setOpen: setResolvedOpen,
    activeIndex,
    selectedValue,
    searchValue: resolvedSearchValue,
    filteredOptions,
    commitValue,
    commitSearchValue,
    selectOption,
    clearValue,
    moveActiveIndex,
    handleInputKeyDown,
    getActiveDescendantId
  };
};
