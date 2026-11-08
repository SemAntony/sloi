# Breaking Changes Policy

Этот документ фиксирует контракт по breaking-изменениям API.

## Core rules

1. Breaking changes допускаются только в `major` релизах.
2. Каждый breaking change обязан иметь:
   - migration section в `CHANGELOG.md`;
   - clear before/after пример API.
3. Deprecation window: минимум `1 minor` до удаления deprecated API.
4. Для breaking-изменений обязателен RFC.

## Что считается breaking

- Удаление или переименование публичного пропа/типа/экспорта.
- Изменение semantics существующего пропа.
- Изменение поведения по умолчанию, ломающее ожидаемый UX.
- Изменение структуры данных, которую потребляют продукты.

## Exception handling

Если выявлен critical defect, который невозможно исправить без breaking:

1. Фикс документируется отдельным блоком `Changed` + `Migration`.
2. Добавляется fallback path, если технически возможно.
3. Релиз маркируется как `major` независимо от объема diff.
