"""Render the real chart and check ServiceAccount references. Requires Helm 3+."""
from pathlib import Path
import re
import subprocess

chart = Path(__file__).resolve().parents[1] / 'tooling/containers/helm'
subprocess.run(['helm', 'lint', str(chart), '--strict'], check=True)
for create, name, expected in [(True, '', 'test-my-app'), (True, 'custom', 'custom'), (False, 'existing', 'existing')]:
    result = subprocess.run(['helm', 'template', 'test', str(chart), '--namespace', 'apps',
                             '--set', f'serviceAccount.create={str(create).lower()}',
                             '--set', f'serviceAccount.name={name}'], capture_output=True, text=True, check=True)
    docs = result.stdout.split('---')
    deployment = next(doc for doc in docs if '\nkind: Deployment\n' in doc)
    account = re.search(r'serviceAccountName: "?([^\s"]+)', deployment).group(1)
    assert account == expected, (account, expected)
    accounts = [doc for doc in docs if '\nkind: ServiceAccount\n' in doc]
    assert len(accounts) == int(create), accounts
    if create:
        assert re.search(r'\n  name: "?([^\s"]+)', accounts[0]).group(1) == account
invalid = subprocess.run(['helm', 'template', 'test', str(chart), '--set', 'serviceAccount.create=false'], capture_output=True, text=True)
assert invalid.returncode != 0 and 'serviceAccount.name' in invalid.stderr, invalid.stderr
print('PASS: chart lint, generated/custom/existing ServiceAccounts, invalid missing account rejected')
