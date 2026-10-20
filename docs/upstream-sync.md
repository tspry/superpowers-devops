# Upstream Sync Record

## Current reviewed baselines

| Source | Reviewed revision | Scope |
|---|---|---|
| [obra/superpowers](https://github.com/obra/superpowers) | `bb92a77741419a4ab5f06e711a283343f1ada0c3` — v7.0.0, 2026-10-09 | Selected workflow content, OpenCode contracts, Cursor hooks, and cross-platform launcher; not a full merge |
| [LukasNiessen/kubernetes-skill](https://github.com/LukasNiessen/kubernetes-skill) | `34f93c1e409156958cc7c410ab1aa88ab512f10f` — 2026-09-13 | Kubernetes core and all six conditional platform references reviewed; selected guidance adapted |

These are **reviewed**, not necessarily byte-for-byte imported, baselines. They are included in the local **1.3.0** version update; publication requires a separate authorized push. The existing manifest version-sync process remains authoritative and does not require GitHub Release automation. Do not advance a baseline past unreviewed changes.

## 2026-10-20 — Windows CRLF example extraction

`tests/tooling.mjs` previously matched only an LF immediately after a Markdown `yaml` fence. A normal Windows CRLF checkout therefore failed before reaching the Kubernetes invariants. The extractor now normalizes line endings, selects examples by their named Markdown section, and reports missing sections or YAML blocks explicitly. An isolated CRLF fixture guards the regression without changing the reviewed upstream baselines.

Verification passed with `bun tests/tooling.mjs`, `bash tests/validate.sh`, `python tests/reliability.py`, `bun tests/opencode.mjs`, `python tests/helm.py`, `python tests/monitoring.py`, and the Git whitespace checks. The locally cached Helm and Prometheus archives matched their published SHA-256 records before the native checks ran. These remain offline parser, rendering, and semantic-invariant checks; they do not establish CloudFormation validity, Kubernetes admission, live infrastructure behavior, or native host compatibility.

## 2026-10-20 — DevOps correctness and safe defaults

### Local vendor-driven corrections

- AWS authorization guidance now diagnoses the effective policy layers, denial type, caller, action, resource, account, region, conditions, and network path before proposing the narrowest authorized change.
- Terraform guidance now covers S3 lockfile compatibility and permissions, mixed-version DynamoDB migration, saved-plan sensitivity, force-unlock ownership, Ansible check-mode limits, and remote-resource ownership before import.
- Docker, proxy, load-balancer, DNS, memory-retention, container-process, and audit guidance now requires evidence and role-specific applicability instead of destructive cleanup, blanket timeout increases, generic propagation waits, or universal workload rules.
- Helm defaults disable ingress, require explicit class/host/TLS inputs when enabled, and omit a generic CPU limit. AWS examples use generated physical names, no default object-version deletion, explicit Lambda artifact/handler/table inputs, exact workload-policy placeholders, and no unexplained generic deny.
- Repository contracts now enforce Agent Skills name/description boundaries, directory equality, unique names, trigger coverage, one valid skill target per command, and deliberate command aliases. Positioning describes a DevOps workflow and safety skill pack rather than a complete intelligence layer.

### Official documentation cross-check

The correction set was checked against primary contracts rather than inferred from examples:

- [Agent Skills specification](https://agentskills.io/specification) for metadata limits, directory matching, and descriptions that state both capability and trigger conditions.
- AWS references for [IAM access-denied evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_access-denied.html), [CloudFormation IAM capabilities](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/control-access-with-iam.html#using-iam-capabilities), [Lambda functions](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-lambda-function.html), and [S3 buckets](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-s3-bucket.html).
- HashiCorp references for the [S3 backend](https://developer.hashicorp.com/terraform/language/backend/s3), [state locking](https://developer.hashicorp.com/terraform/language/state/locking), and [saved plans](https://developer.hashicorp.com/terraform/cli/commands/plan), plus the [Ansible check-mode contract](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_checkmode.html).
- Docker references for [system pruning](https://docs.docker.com/reference/cli/docker/system/prune/) and [multi-service containers](https://docs.docker.com/engine/containers/multi-service_container/).
- Kubernetes references for [images](https://kubernetes.io/docs/concepts/containers/images/), [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/), [probes](https://kubernetes.io/docs/concepts/workloads/pods/probes/), [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/), and [resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).
- Helm's [template function contract](https://helm.sh/docs/chart_template_guide/function_list/), systemd's [`resolvectl`](https://www.freedesktop.org/software/systemd/man/latest/resolvectl.html), NGINX's [`ngx_http_proxy_module`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html), Python's [`gc`](https://docs.python.org/3/library/gc.html), and MDN's [JavaScript memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management).
- IETF [DNS protocol TTL semantics](https://www.rfc-editor.org/rfc/rfc1035) and [negative caching](https://www.rfc-editor.org/rfc/rfc2308) for positive and negative cache behavior.

This pass corrected three mismatches found during that review: skill-description guidance now includes capability and trigger conditions; the Lambda example documents `CAPABILITY_IAM` and uses the current documented memory range; DNS TTL guidance no longer presents fixed values as universal defaults. Live provider validation remains outside this repository's offline checks.

### Evidence and limits

`bash tests/validate.sh`, `python tests/reliability.py` (9 tests), `bun tests/opencode.mjs`, `bun tests/tooling.mjs`, `python tests/helm.py`, `python tests/monitoring.py`, and both Git whitespace checks passed. The Helm test exercises disabled/default ingress, rejection of incomplete ingress, explicit TLS ingress, resource defaults, and ServiceAccount modes. The tooling test exercises the new AWS default/input invariants.

Available CLI version checks found Claude Code 2.1.288, OpenCode 2.0.32, and Codex CLI 0.153.4. Cursor, Kimi, and Pi were unavailable; the installed Gemini command was broken because its bundled module was missing. No host installation or user configuration was changed, so native skill discovery, entrypoint injection, parent/child behavior, and updates remain unverified. No skill consolidation was performed: behavioral evidence was intentionally omitted from this pass, so merging distinct trigger paths would be unsupported.

## 2026-10-19 — Reliability and Kubernetes follow-up

### Platform and validation adaptations

- `.opencode/plugins/superpowers-devops.js` follows upstream's `server`/`setup` split: 1.x skill paths and message transform; 2.0.4+ explicit registration and context hook; parent/child guards, deduplication, and compaction reinjection. `tests/opencode.mjs` adapts upstream `tests/opencode/test-skill-registration.mjs` contract scenarios. CJS keeps this fork's existing `package.json` entry without adding dependencies. This fork deliberately permits only single-line skill frontmatter fields (enforced by checks), uses its own bootstrap marker, and does not copy the generic workflow artifacts or parser machinery.
- Cursor now declares native skill discovery and `hooks/hooks-cursor.json` with its own `version: 1` / `sessionStart` schema, following upstream's Cursor packaging rather than reusing Claude's `SessionStart` schema. Claude's config remains separate. Hook command/output tests run through Bash; this is not a native host-installation certification.
- The launcher follows upstream's safe native Bash discovery and execution outside `cmd.exe` blocks; its previous lost-exit-status bug was reproduced and fixed. Native Windows exit propagation, spaced arguments/paths, empty PATH dispatch, and LF checkout attributes have regression checks. Missing Bash is an explicit error here rather than upstream's silent success. Session-hook `shell: bash` config still requires host-version verification before adoption.
- Fixed the pre-commit first-filename omission. Added exact tooling inventory/reference checks, version parity, adapter contracts, real Helm rendering, Kubernetes example invariants, AWS parameter wiring, and real Prometheus alert fixtures. See `tests/README.md` for commands and what each proves.
- Repaired Helm ServiceAccount creation/selection, replaced invented ECS network IDs with required inputs, and removed deprecated Lambda runtime choices. Corrected alert label aggregation, secret-handling examples, remote-firewall recovery controls, and applicability of code-audit checks. These are local DevOps correctness fixes, not attributed upstream changes.
- Replaced claims about nonexistent bundled assets with an exact `tooling/README.md` inventory and guidance-only status. No new skills or speculative template directories were added. Installation docs distinguish native adapters from explicit skill loading and untested host combinations.
- Retained the original Jesse Vincent MIT copyright in the root license; Kubernetes adaptations retain Lukas Niessen's full MIT notice alongside that skill.

### Kubernetes provenance and mapping

The fork introduced Kubernetes content in `f93fc36e0bb13ae18a37b178a53ab6d796a5365f` (2026-07-14) without recording the source revision. The original source baseline is therefore **unknown**; this pass compares the current fork with the complete reviewed upstream content rather than inventing a previous SHA. The latest upstream core/reference changes at the reviewed head are `b7d3250` and `3536b12` (2026-05-02); later commits primarily concern documentation/dependency maintenance, not new core guidance.

| Upstream paths | Local adaptation |
|---|---|
| `SKILL.md` | `skills/kubernetes/SKILL.md`: failure-mode-first review, actual context/CNI/controller discovery, workload identity, probes, restricted-policy caveats, selectors/ports, and layered validation |
| `references/validation-and-policy.md` | Core validation section: explicit target version, missing CRD schemas reported as unvalidated, dry-run/discovery limits, normal `kubectl diff` exit 1, safe rollout/GitOps rollback, PDB/HPA rounding |
| `references/conditional/{eks,gke,aks,openshift}-patterns.md` | `skills/kubernetes/platform-patterns.md`: conditional identity, networking, storage/controller and policy guidance |
| `references/conditional/gitops-controllers.md`, `references/conditional/observability-stacks.md` | Same conditional local reference: reconciliation ownership/order, ServiceMonitor selectors, collector topology, log cardinality, and runtime evidence |
| `LICENSE` | `skills/kubernetes/UPSTREAM-LICENSE`, retaining Lukas Niessen's MIT notice |

**Deliberate differences:** retain repo/chat dual mode, project inventory, authorization/rollback controls, and the existing skill count. Do not import unrelated package/dependency setup or claim upstream prose is executable validation. Correct rather than copy assumptions that client dry-run is offline, missing CRD schemas are validated, a root init container meets restricted policy, exact HPA/PDB equality guarantees eviction, or a version tag is intrinsically immutable. Platform references load only when applicable; their examples require actual cluster/provider validation.

### Evidence from this pass

- `bash tests/validate.sh`: passed all 28 skills, trigger references, and both indexed executable modes.
- `python tests/reliability.py`: 8 passed on Windows, including actual LF-wrapper execution through `cmd.exe`, quoted arguments/spaced paths, pre-commit file coverage, manifest parity, inventory/links, and hook payloads.
- `bun tests/opencode.mjs`: passed synthetic V1/V2 registration, config preservation, bootstrap/compaction, child exclusion, transient lookup retry, and per-skill rejection isolation.
- `bun tests/tooling.mjs`: passed parsed AWS input wiring and Kubernetes example resource/selector/port/security invariants.
- `python tests/helm.py` with Helm 3.19.0: strict lint/render cases passed. `python tests/monitoring.py` with promtool 3.15.0: alert fixtures passed and the old incorrect ratio was rejected by mutation.
- `bash -n hooks/run-hook.cmd hooks/session-start tests/validate.sh`, `git diff --check`, and `git diff --cached --check`: passed. Git emits checkout line-ending notices; `.gitattributes` pins the polyglot hook files to LF.
- **Limits:** no native macOS/Linux or real host-installation matrix, no live cloud/cluster apply, no full CloudFormation/admission certification, and no agent-pressure behavioral evaluation. Manual code/content review completed; independent reviewer dispatch was unavailable (the harness rejected its agent type). Fixture/contract success establishes only the claims described in `tests/README.md`.

## Repeatable update procedure

1. **Start cleanly:** inspect `git status` and preserve local work. Read this record and `AGENTS.md`; define which source areas affect this fork before editing.
2. **Fetch each source explicitly** (no remote configuration required):
   ```bash
   git fetch --no-tags https://github.com/obra/superpowers.git main
   git rev-parse FETCH_HEAD
   git log --oneline bb92a77741419a4ab5f06e711a283343f1ada0c3..FETCH_HEAD
   git diff --stat bb92a77741419a4ab5f06e711a283343f1ada0c3 FETCH_HEAD
   git fetch --no-tags https://github.com/LukasNiessen/kubernetes-skill.git HEAD
   git rev-parse FETCH_HEAD
   git log --oneline 34f93c1e409156958cc7c410ab1aa88ab512f10f..FETCH_HEAD
   git diff --stat 34f93c1e409156958cc7c410ab1aa88ab512f10f FETCH_HEAD
   ```
   Record each candidate SHA before the next fetch overwrites `FETCH_HEAD`. Avoid importing upstream tags into the fork's release namespace. Substitute the current table's baseline on subsequent syncs; review exact diffs and full affected source/tests with `git diff` / `git show`, not only release summaries.
3. **Classify every relevant change:** adapt now, already covered, defer with reason, or exclude as outside DevOps scope. Check host APIs against official docs/installed types and examples against actual tool behavior. Do not blindly merge workflow machinery or copy unsupported claims. Inspect licenses when copying content.
4. **Keep mappings coupled:** update the local skill/supporting reference, trigger table/commands if needed, exact inventory, install guidance, tests, and instruction files together. No new skill without a deprecate-before-add decision. Platform wiring changes require explicit scope and host-specific contract checks.
5. **Run evidence:** baseline plus applicable template/alert checks in `tests/README.md`; review links and instructions manually. Record failures, unavailable tools/hosts, unverified live behavior, and any fixture/mutation results. Native host compatibility requires its own smoke evidence.
6. **Update this record:** exact reviewed SHAs/dates, source→local mappings, accepted changes, differences/deferred items, commands/results/limits. Keep historical entries; if scope is only partly reviewed, leave the baseline unchanged and record the partial range separately. Commit/release only when authorized. A future release must sync all plugin version manifests; never confuse the `.opencode` SDK version with the fork version.

## 2026-10-19 — macOS Hook Permission Fix

The hook configs directly execute `hooks/run-hook.cmd`, but both it and `hooks/session-start` were tracked as `100644`. Restore their executable modes (`100755`), matching upstream, so Unix plugin installs can launch them. Structural validation now checks Git's tracked modes even on Windows with `core.filemode=false`. This permission fix does not import the deferred Windows launcher/runtime changes below.

## 2026-10-19 — Selected Skill Updates Through v7.0.0

- **Upstream:** [obra/superpowers](https://github.com/obra/superpowers)
- **Previous fork sync:** `f93fc36e0bb13ae18a37b178a53ab6d796a5365f` (2026-07-14), which recorded upstream v6.1.1
- **Compared range:** [`v6.1.1...v7.0.0`](https://github.com/obra/superpowers/compare/v6.1.1...v7.0.0)
- **Reviewed upstream head:** [`bb92a77741419a4ab5f06e711a283343f1ada0c3`](https://github.com/obra/superpowers/commit/bb92a77741419a4ab5f06e711a283343f1ada0c3), tagged v7.0.0 (2026-10-09)
- **Method:** Selective adaptation of skill content, not a wholesale merge. This records the reviewed baseline, not full platform/runtime parity or a fork version bump.

### Adapted for This Fork

| Upstream direction | DevOps adaptation |
|---|---|
| Intent-first, right-sized brainstorming (v7.0.0) | Establish purpose and ownership of platform choices; use direct edits, chat designs, or written designs according to scope. Preserve environment, blast-radius, rollback, secret, and production-action controls. |
| Lean plans and review focus (v6.4.1–v6.4.2) | Record decisions, exact values, interfaces, expected assertions, target environment, and rollback rather than routine implementation bodies. Tie up to five review risks to owning-task checks. |
| Explicit inline execution and user choice | Honor inline vs delegated execution, keep progress/evidence, resume unfinished work after context loss, and review the whole change. No imported orchestration scripts or artifact framework. |
| Single task review and bounded fix loops | One reviewer returns spec-compliance and quality verdicts. Resume the implementer, scope re-review to fixes, and escalate after five unsuccessful rounds. Replace the local reference to a missing implementer template with inline task contracts. |
| Stronger reviewer contracts | Read-only, no nested agents, full task/branch diff coverage, explicit unverified areas, and reasonable expected behavior beyond literal spec compliance. Retain IAM, network, secrets, migration, and rollback checks. |
| Positive test-quality guidance | Add a DevOps testing reference: falsifiable assertions, independent expectations, safe fault/mutation checks, and clear limits of schema/dry-run/mocked evidence. Keep project-required final checks. |
| Secret-safe debugging | Gather evidence at component boundaries; log secret presence, not values. Add regression evidence and verification before claiming a fix. |
| Safer branch completion | Capture worktree identity before changing directories; offer merge/PR/keep, handle discard only on explicit request, and preserve work on verification or cleanup refusal. |
| Skill-authoring refinements | Match guidance form to the observed failure; invoke shipped scripts through interpreters so packaging does not depend on executable bits. |

README, slash-command wording, and the authoritative trigger table follow the inline/delegated distinction. Existing DevOps domain skills, tooling templates, and skill count remain intact.

### Deferred or Not Imported

- **OpenCode 2 runtime:** originally deferred; adapter and synthetic contracts are now implemented in the reliability follow-up above. Native host/version installation smoke testing remains unverified.
- **Windows hooks:** safe native Bash discovery, PATH-independent Bash dispatch, and exit propagation are now adapted; native `cmd.exe` checks reproduce and guard the old lost-exit-code bug. Unlike upstream's silent success without Bash, this fork reports a missing prerequisite. Host-specific `shell: bash` config is not imported without a verified minimum host version; native host installation remains a separate smoke check.
- **Additional platform packaging:** Antigravity, Muse, Hermes, and Devin support are outside this focused skill sync.
- **New session-diagnosis skill:** `diagnosing-superpowers` is agent-session support, not a core DevOps domain addition. No new skill is added without a deprecate-before-add decision.
- **Generic workflow machinery:** browser visual companion, full upstream orchestration artifacts/scripts, and unrelated application-development examples are not copied into this content-focused fork.
- **Upstream cleanup without a local match:** retain the substantive local `CLAUDE.md` and Gemini wiring. Do not infer removal from an intermediate upstream change that was later reverted.

### Verification

The original skill-only pass used `bash tests/validate.sh`, `git diff --check`, and manual review. The reliability follow-up expands the required gate as documented in `tests/README.md`. Structural and synthetic checks do not establish agent-behavior compliance, real cloud/cluster behavior, or native host compatibility.
