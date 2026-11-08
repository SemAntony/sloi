# Icon/Token Change Request Template

Шаблон для запросов на добавление/изменение иконок и color-токенов.

Связанный policy: [Iconography and color token policy](./iconography-color-token-policy.md)
GitHub Issue Form: [`.github/ISSUE_TEMPLATE/icon-token-change-request.yml`](../../.github/ISSUE_TEMPLATE/icon-token-change-request.yml)

## 1) Когда использовать issue, а когда RFC

1. `Issue` достаточно, если:
   - добавляется новая иконка без изменения API `Icon`;
   - добавляется semantic token без breaking-поведения;
   - изменение локальное и не влияет на контракты нескольких модулей.
2. `RFC` обязателен, если:
   - меняется API `Icon` (`size`, `tone`, accessibility contract);
   - меняется структура palette/semantic-token слоев;
   - есть риск breaking-изменений для consumers;
   - меняются cross-component foundations.

## 2) Lightweight Issue Template (copy-paste)

```md
# Icon/Token Change Request

## Request type
- [ ] New icon
- [ ] Icon update/deprecate
- [ ] New color token
- [ ] Token update/deprecate

## Use-case
1. Product/consumer: `<name>`
2. Scenario: `<where and why>`
3. Blocking pain: `<what cannot be solved with existing assets>`

## Evidence
1. Link to ticket/issue: `<url>`
2. Tier-1 component or consumer screen: `<component/screen>`
3. Why existing icon/token cannot be reused: `<short rationale>`

## Proposed change
1. Candidate names:
   - icon: `<icon-name>` (if applicable)
   - token: `--sloi-...` (if applicable)
2. Semantic role:
   - `<role description>`
3. Theming:
   - light mapping: `<token/value>`
   - dark mapping: `<token/value>`

## Impact
1. Affected components: `<list>`
2. A11y impact: `<none / describe>`
3. Migration needed: `<no / yes + notes>`

## Icon accessibility contract (for icon changes)
1. Icon intent:
   - `<decorative | informative>`
2. If informative:
   - accessible label: `<label text>`
3. If icon-only control:
   - accessible name source: `<Icon label | control aria-label>`

## Validation plan
1. Storybook updates: `<stories>`
2. Tests: `<unit/a11y updates>`
3. Quality gates: `typecheck`, `lint`, `test`, `test:a11y`, `storybook:build`, `adoption:metrics:ci`

## Definition of Done
- [ ] Use-case validated by owner.
- [ ] No raw HEX introduced in `src/shared/ui/*`.
- [ ] Docs/story/tests updated.
- [ ] Changelog updated if user-visible.
```

## 3) RFC Addendum Template (for foundation-level changes)

Используй базовый [RFC template](./rfc-template.md) и добавь обязательные секции ниже.

```md
## Foundation Scope
1. Что меняется в icon/token model.
2. Почему это нельзя решить локальным issue.

## Naming and Contract
1. Final naming proposal (`Icon` API or token names).
2. Backward compatibility strategy.
3. Deprecation window (if applicable).

## Theming and Semantics
1. Semantic mapping (light/dark).
2. Принципы использования (do/don't).
3. Impact on existing components and consumers.

## Adoption and KPI impact
1. Effect on `tokens_total`, `tokens_used_in_ui`, `unknown_local_overrides`.
2. Rollout plan for 1-2 pilot consumers.
3. Success thresholds and rollback trigger.
```

## 4) Reviewer Checklist

- [ ] Есть подтвержденный use-case и evidence.
- [ ] Изменение укладывается в budget limits policy.
- [ ] Семантика и нейминг не дублируют существующие assets.
- [ ] Есть план тестов, docs и rollout.
- [ ] Для risky/breaking изменений создан RFC.
