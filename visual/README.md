# Визуальные регрессии (Playwright)

Снимки делаются со статической сборки Storybook, поэтому сначала нужен `pnpm storybook:build`.

```bash
pnpm storybook:build          # собрать storybook-static
pnpm test:visual              # сравнить с базовыми снимками
pnpm test:visual:update       # осознанно обновить базовые снимки после изменения дизайна
```

- Тема переключается глобалом Storybook: `/iframe.html?id=<story-id>&viewMode=story&globals=theme:dark`.
- Базовые снимки лежат в `visual/*.spec.ts-snapshots/`, в имени файла суффикс ОС (`-darwin`, `-linux`):
  шрифты и сглаживание на macOS и Linux различаются, поэтому снимки с Mac не годятся для Linux-CI.
- Новый компонент: добавить его story-id в массив в `*.visual.spec.ts` (или новый файл), запустить
  `pnpm test:visual:update`, открыть получившиеся PNG и проверить их глазами перед коммитом.
- Анимации отключены (`animations: 'disabled'`, `reducedMotion: 'reduce'`), допуск на различие нулевой.
- Отчёт о падении: `playwright-report/` (в git не попадает), `pnpm exec playwright show-report`.
