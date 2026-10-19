# Verification

This is a skill/plugin repository, not an application. Checks use Bash/Git, Python 3, Node or Bun, and the native Helm/promtool CLIs; no npm/pip test packages are required. Run from the repository root. Missing tools are blockers for their check, not a passing result.

## Required baseline

```bash
bash tests/validate.sh
python tests/reliability.py
node tests/opencode.mjs # or: bun tests/opencode.mjs
git diff --check
git diff --cached --check
```

- `validate.sh`: frontmatter presence, entrypoint references, and executable modes in Git's index. On Windows, `core.filemode=false` can hide a Unix permission regression; both hook executables must be tracked as `100755`.
- `reliability.py`: manifest version parity, skill discovery/frontmatter contracts, tooling paths/inventory, local Markdown links, actual pre-commit first-file handling, and Claude/Cursor hook command/output contracts. Checks spaced paths, empty PATH dispatch and LF attributes; on Windows it also exercises native `cmd.exe` exit propagation. Requires Bash on PATH (Git Bash on Windows).
- `opencode.mjs`: real adapter exports with synthetic 1.x/2.x host inputs; skill registration, config preservation, parent/child exclusion, deduplication, context reinjection, and compaction. These tests adapt upstream's contract-testing approach; they do not launch an OpenCode host.

## Required when changing templates or related examples

```bash
bun tests/tooling.mjs
python tests/helm.py
python tests/monitoring.py
```

- `tooling.mjs` uses Bun's built-in YAML parser to check AWS input wiring and cross-resource invariants in the Kubernetes GOOD examples. It preserves this repository's simple `!Ref` forms; other tags are not evaluated. It is not a CloudFormation/schema/admission validator. Pinning supported Lambda runtimes still requires checking AWS's lifecycle table during maintenance.
- `helm.py` requires `helm` on PATH; runs real strict lint and rendering for generated/custom/existing ServiceAccounts and rejection of an unspecified existing account. It proves chart rendering, not image compatibility, readiness, admission, or a running cluster.
- `monitoring.py` requires `promtool` on PATH; evaluates the skill's real alert against healthy/high-error/no-5xx/idle counter fixtures, then confirms the old label-matching bug fails those fixtures. It proves that alert behavior for the declared metric schema, not scrape availability or notification delivery.

For a full reliability pass run all six checks, even if no template was changed. Review Markdown examples and changed instructions manually as well. Tools downloaded for local verification may live in ignored `.local-tools/`; do not commit binaries or add package dependencies. Use official releases and verify published checksums. The 2026-10-19 pass used Helm 3.19.0 and promtool 3.15.0 on Windows/Git Bash.

## Host and deployment evidence

Before claiming support for a host/version/OS, install the plugin in a disposable project **outside this clone**, restart the host, and verify skill discovery, parent bootstrap, child-session behavior, and update behavior. Test the native Windows launcher with `cmd.exe`, not only Bash. On macOS/Linux verify the installed files' executable modes. Keep failures and unavailable combinations explicit; repository contracts are not an installation matrix.

No check applies infrastructure. Deployment evidence requires the intended account/region/cluster/namespace, approved plan/diff, credentials, admission/CRD/controller checks, readiness/routing checks, and rollback evidence. Schema validation, client/server dry-run, and rendering each establish narrower claims. Do not apply to production to satisfy repository checks.

Content checks do not establish that agents follow instructions under pressure; report behavioral evaluation separately. Update the evidence and remaining limits in [the upstream record](../docs/upstream-sync.md) whenever either upstream is adapted.
