# Installing for OpenCode

The adapter follows obra/superpowers v7's native APIs: `server` hooks for 1.x and `setup` registration for 2.0.4+. Repository contract checks cover both APIs; actual host/version installation still needs the smoke check below.

Clone to a persistent location, then add its **absolute repository directory** to your existing OpenCode config. The root package's `main` resolves the adapter. Merge the entry with existing plugins; do not overwrite other settings. Do not use a literal `~` or point V2 at a JavaScript file.

```bash
git clone https://github.com/tspry/superpowers-devops /absolute/path/superpowers-devops
```

OpenCode **1.x**:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["/absolute/path/superpowers-devops"]
}
```

OpenCode **2.0.4+**:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": ["/absolute/path/superpowers-devops"]
}
```

On Windows use an absolute path such as `D:/Tools/superpowers-devops`. Do not also install a discovered copy of the same adapter. Native skill names are unprefixed; avoid installing another bundle with conflicting names without resolving ownership.

Quit and restart OpenCode. From a different project, ask it to list native skills and load `kubernetes`. Confirm the entrypoint/trigger table is present in the main session and that a delegated child does not restart the controller workflow. The plugin registers the clone's skill paths in V1 and full skill payloads in V2.

Update the clone with a fast-forward pull after reviewing local changes, then restart. A local clone avoids git-package cache ambiguity. Use a reviewed commit/tag for reproducible installs. Report loading errors with OpenCode version, configured path, and redacted logs; do not infer successful installation from this repository's unit checks.

See [official plugin documentation](https://opencode.ai/docs/plugins/) and the [fork maintenance record](../docs/upstream-sync.md).
