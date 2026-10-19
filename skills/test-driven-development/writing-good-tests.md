# Writing Good DevOps Tests

Use this guidance whenever writing or changing a test, including regression tests outside a full TDD cycle.

## Start With the Claim

Name the observable requirement and the defect that would falsify it. Derive expected values from the requirement, not from the code/config being tested. Prefer the existing project tooling or a small standard-library assertion over a new framework.

| Claim | Evidence that supports it | What is insufficient |
|---|---|---|
| Terraform resource has the required settings | Assertions on evaluated plan attributes, with `command = plan` where sufficient | Grepping HCL for a field name |
| Manifest obeys policy | Parse rendered resources and assert the required values/relationships | YAML parses or `kind: Deployment` exists |
| Service routes to healthy pods | Isolated integration check of endpoints, readiness, and traffic | API dry-run accepts the Service |
| Script handles a failed dependency | Run with controlled input/dependency failure; assert exit status and useful output | Checking that the source contains `exit 1` |
| Alert fires and recovers correctly | Rule evaluation with input series, timing, and expected alerts | `promtool check rules` alone |
| CI job enforces the rule | Execute its assertions against valid and invalid fixtures | Runner planning succeeds |

Static validation is valuable for static claims. Keep it; do not report it as proof of connectivity, IAM authorization, rollout health, or recovery.

## Make It Falsifiable

1. Choose one behavior or invariant, including a failure case when relevant.
2. Exercise the real artifact through its public input/output or evaluated configuration.
3. Use independent expected results. Avoid computing the expected result with the implementation's own helper or copying its output into the assertion.
4. Observe the intended failure before the fix. If the test already passes, check whether it actually reaches the changed behavior.
5. As a quick confidence check, ask whether reverting the fix or changing the protected value would make this assertion fail. When safe, try that temporary mutation and restore it before final verification. Never mutate live infrastructure for this check.

For example, a policy test for a required two-replica deployment should parse the rendered manifest and assert `spec.replicas == 2`. Checking for the string `replicas` passes when it is `0`, appears only in a comment, or belongs to another object.

## Keep the Test Honest and Small

- Use deterministic inputs, isolated resources, and bounded timeouts. A failure should identify the violated requirement rather than an unrelated setup error.
- Mock external boundaries when necessary, but make a bounded claim: a mocked provider test cannot prove real cloud permissions or service availability.
- Include concrete failure output and cleanup/rollback for integration checks. Verify target account, region, cluster, and namespace; never use production as a convenient test fixture.
- Do not print credentials, tokens, or raw secret-bearing environment/config values in failures.
- Re-run affected checks after fixes and the full project-required verification before completion. Report unavailable live checks and existing failures explicitly.
- For prose-only changes, use the project's structural/content checks and manual consistency review. Agent-behavior evaluation is separate evidence; do not claim it from a Markdown validator.
