import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { FilterBar } from './filter-bar';

const searchbox = () => screen.getByRole('searchbox');

describe('FilterBar', () => {
  it('рендерит форму с поиском, кнопками Search и Reset, пробрасывает ref и атрибуты', () => {
    const ref = createRef<HTMLFormElement>();
    render(<FilterBar ref={ref} aria-label='Users filter' className='custom' />);

    const form = screen.getByRole('form', { name: 'Users filter' });
    expect(ref.current).toBe(form);
    expect(form).toHaveClass('custom');
    expect(searchbox()).toHaveAttribute('placeholder', 'Search');
    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute('type', 'submit');
    expect(screen.getByRole('button', { name: 'Reset' })).toHaveAttribute('type', 'button');
  });

  it('placeholder и подписи кнопок настраиваются', () => {
    render(<FilterBar placeholder='Find user' searchButtonLabel='Go' resetButtonLabel='Clear all' />);

    expect(searchbox()).toHaveAttribute('placeholder', 'Find user');
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeInTheDocument();
  });

  it('showSearchButton и showResetButton скрывают кнопки', () => {
    render(<FilterBar showSearchButton={false} showResetButton={false} />);

    expect(screen.queryByRole('button', { name: 'Search' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument();
  });

  it('рендерит filters и actions только когда они заданы', () => {
    const { rerender, container } = render(<FilterBar />);
    expect(container.querySelector('[class*="filters"]')).not.toBeInTheDocument();

    rerender(<FilterBar filters={<span>Status filter</span>} actions={<button type='button'>Export</button>} />);
    expect(screen.getByText('Status filter')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  describe('неуправляемый режим', () => {
    it('defaultQuery и ввод, onQueryChange получает значение', async () => {
      const user = userEvent.setup();
      const onQueryChange = vi.fn();
      render(<FilterBar defaultQuery='re' onQueryChange={onQueryChange} />);

      expect(searchbox()).toHaveValue('re');
      await user.type(searchbox(), 'act');
      expect(searchbox()).toHaveValue('react');
      expect(onQueryChange).toHaveBeenLastCalledWith('react');
    });
  });

  describe('управляемый режим', () => {
    it('значение остаётся за родителем', async () => {
      const user = userEvent.setup();
      const onQueryChange = vi.fn();
      render(<FilterBar query='ab' onQueryChange={onQueryChange} />);

      await user.type(searchbox(), 'c');
      expect(onQueryChange).toHaveBeenCalledWith('abc');
      expect(searchbox()).toHaveValue('ab');
    });

    it('работает как обычный controlled-компонент', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [query, setQuery] = useState('');
        return <FilterBar query={query} onQueryChange={setQuery} />;
      }
      render(<Controlled />);

      await user.type(searchbox(), 'hi');
      expect(searchbox()).toHaveValue('hi');
    });
  });

  describe('поиск', () => {
    it('клик по Search вызывает onSearch с текущим запросом и не отправляет форму', async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      const onSubmit = vi.fn();
      render(<FilterBar defaultQuery='react' onSearch={onSearch} onSubmit={onSubmit} />);

      await user.click(screen.getByRole('button', { name: 'Search' }));
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith('react');
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('Enter в поле запускает поиск', async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<FilterBar onSearch={onSearch} />);

      await user.type(searchbox(), 'vue{Enter}');
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith('vue');
    });

    it('Enter работает и без кнопки Search', async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<FilterBar showSearchButton={false} onSearch={onSearch} />);

      await user.type(searchbox(), 'vue{Enter}');
      expect(onSearch).toHaveBeenCalledWith('vue');
    });

    it('onSubmit с preventDefault отменяет onSearch', async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<FilterBar defaultQuery='x' onSearch={onSearch} onSubmit={(event) => event.preventDefault()} />);

      await user.click(screen.getByRole('button', { name: 'Search' }));
      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  describe('сброс', () => {
    it('очищает запрос и вызывает onQueryChange(""), onReset и onSearch("")', async () => {
      const user = userEvent.setup();
      const onQueryChange = vi.fn();
      const onReset = vi.fn();
      const onSearch = vi.fn();
      render(<FilterBar defaultQuery='react' onQueryChange={onQueryChange} onReset={onReset} onSearch={onSearch} />);

      await user.click(screen.getByRole('button', { name: 'Reset' }));
      expect(searchbox()).toHaveValue('');
      expect(onQueryChange).toHaveBeenLastCalledWith('');
      expect(onReset).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith('');
    });

    it('в управляемом режиме запрос сбрасывает родитель', async () => {
      const user = userEvent.setup();
      const onQueryChange = vi.fn();
      render(<FilterBar query='react' onQueryChange={onQueryChange} />);

      await user.click(screen.getByRole('button', { name: 'Reset' }));
      expect(onQueryChange).toHaveBeenCalledWith('');
      expect(searchbox()).toHaveValue('react');
    });
  });

  describe('disabled', () => {
    it('отключает поиск, кнопку очистки и обе кнопки панели, но не filters и actions', () => {
      render(
        <FilterBar
          disabled
          defaultQuery='q'
          filters={<button type='button'>Filter</button>}
          actions={<button type='button'>Export</button>}
        />
      );

      expect(searchbox()).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Clear search' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Filter' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Export' })).toBeEnabled();
    });
  });

  describe('a11y', () => {
    const options = { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } };

    it('нет нарушений: базовая и с filters и actions', async () => {
      const { container } = render(
        <FilterBar
          aria-label='Users filter'
          defaultQuery='q'
          filters={<button type='button'>Status</button>}
          actions={<button type='button'>Export</button>}
        />
      );

      expect((await axe(container, options)).violations).toHaveLength(0);
    });
  });
});
