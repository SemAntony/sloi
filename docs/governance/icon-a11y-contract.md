# Icon Accessibility Contract

Документ фиксирует обязательный accessibility-контракт для `Icon` в публичной дизайн-системе.

Связанные артефакты:

1. [Icon component API](/Users/sem/WebstormProjects/sloi-ui/src/shared/ui/icon/icon.tsx)
2. [Icon stories](/Users/sem/WebstormProjects/sloi-ui/src/shared/ui/icon/icon.stories.tsx)
3. [Icon unit tests](/Users/sem/WebstormProjects/sloi-ui/src/shared/ui/icon/icon.test.tsx)
4. [Icon a11y tests](/Users/sem/WebstormProjects/sloi-ui/src/shared/ui/icon/icon.a11y.test.tsx)
5. [Iconography and color token policy](./iconography-color-token-policy.md)

## 1) Decorative vs informative

1. `decorative` по умолчанию `true`.
2. Декоративная иконка должна быть скрыта от assistive tech (`aria-hidden`).
3. Если иконка несет смысл (informative), обязательно:
   - `decorative={false}`;
   - `label` с коротким человеко-читаемым названием.
4. Для non-TypeScript потребителей runtime guard логирует ошибку, если informative иконка передана без `label`.

## 2) Interactive controls contract

1. Иконка внутри кнопки с текстом обычно остается декоративной.
2. Icon-only control обязан иметь доступное имя:
   - либо через `Icon` (`decorative={false}` + `label`);
   - либо через `aria-label` на самом control (предпочтительно дублировать не нужно).
3. Для destructive и системно-критичных действий (delete/reset/confirm) icon-only вариант без явного accessible name запрещен.

## 3) Tone and semantic meaning

1. `tone='current'` — дефолт для наследования цвета от контекста.
2. `tone='info|success|warning|danger'` — только для смысловых статусных сценариев.
3. Цвет иконки не должен быть единственным носителем смысла: добавляйте текст/label/подпись.

## 4) Do / Don't

### Do

```tsx
<button type='button'>
  <Icon icon={IconSearch} />
  Search incidents
</button>

<button type='button'>
  <Icon icon={IconBell} decorative={false} label='Notifications' />
</button>
```

### Don't

```tsx
// informative icon without accessible name
<button type='button'>
  <Icon icon={IconBell} decorative={false} />
</button>

// color-only meaning without text context
<Icon icon={IconAlertTriangle} tone='warning' />
```

## 5) Validation checklist

- [ ] Decorative and informative modes покрыты в stories.
- [ ] Unit tests проверяют runtime guard и стабильные a11y hooks.
- [ ] `test:a11y` проходит для icon scenarios без `error` violations.
- [ ] Consumer-facing docs содержат guidance по icon-only controls.
