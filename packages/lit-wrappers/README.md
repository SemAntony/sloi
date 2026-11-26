# @sloi/lit-wrappers

Thin wrapper layer for Lit runtime in the Sloi multi-framework strategy.

> **Status: frozen research scaffold (D36).** The package exports only scope and status constants (every component is `planned`); there are no Lit components. Resume only on confirmed demand (`MF-05`).

## Contract

1. No duplicated domain logic in wrappers.
2. Behavior/state contracts come from `@sloi/headless-core` design decisions.
3. API parity with React wrappers is required before components are marked stable.

## Planned scope (not implemented)

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

1. [Thin wrappers contract](../../docs/governance/wrapper-thin-contract.md)
2. [Headless core boundary](../../docs/governance/headless-core-boundary.md)
3. [Public API semver contract](../../docs/governance/public-api-semver-contract.md)
