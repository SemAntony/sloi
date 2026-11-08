# @sloi/lit-wrappers

Thin wrapper layer for Lit runtime in the Sloi multi-framework strategy.

## Contract

1. No duplicated domain logic in wrappers.
2. Behavior/state contracts come from `@sloi/headless-core` design decisions.
3. API parity with React wrappers is required before components are marked stable.

## Scope for upcoming implementation

1. `Dialog`
2. `Select`
3. `Tooltip`
4. `Tabs`
5. `Combobox`

## Current package exports

1. `LIT_WRAPPER_SCOPE`
2. `litWrapperStatus`
3. `LIT_WRAPPERS_STAGE`

## Governance links

1. [Thin wrappers contract](/Users/sem/WebstormProjects/sloi-ui/docs/governance/wrapper-thin-contract.md)
2. [Headless core boundary](/Users/sem/WebstormProjects/sloi-ui/docs/governance/headless-core-boundary.md)
3. [Public API semver contract](/Users/sem/WebstormProjects/sloi-ui/docs/governance/public-api-semver-contract.md)
