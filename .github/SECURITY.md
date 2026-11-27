# Security Policy

## Supported versions

Security fixes are released for the latest stable `@sloi/ui-kit` version (and for the current release candidate while a stable release of the same minor is pending). Older versions do not receive fixes.

## Reporting a vulnerability

Please do not open a public issue for security problems.

1. Preferred: use GitHub private vulnerability reporting: <https://github.com/SemAntony/sloi/security/advisories/new>.
2. Alternative: email sem.antony.dev@gmail.com with the subject `[sloi-ui security]`.

Please include the affected version, a description of the problem, and steps or a minimal example to reproduce it.

You can expect an acknowledgement within 7 days. After the report is confirmed, a fix is prepared and released as a patch version, and the advisory is published with credit to the reporter (unless you prefer to stay anonymous).

## Scope

In scope: the published `@sloi/ui-kit` package (components, styles, exported tokens) and this repository's build and release workflows.

Out of scope: vulnerabilities in third-party dependencies that are not exploitable through `@sloi/ui-kit` (report those upstream), and issues in applications that consume the library.
