"""Render the real chart and check safe defaults and ServiceAccount references. Requires Helm 3+."""
from pathlib import Path
import re
import subprocess

chart = Path(__file__).resolve().parents[1] / 'tooling/containers/helm'


def template(*args, check=True):
    return subprocess.run(['helm', 'template', 'test', str(chart), '--namespace', 'apps', *args],
                          capture_output=True, text=True, check=check)


subprocess.run(['helm', 'lint', str(chart), '--strict'], check=True)
default = template()
assert '\nkind: Ingress\n' not in default.stdout
assert 'cpu: 100m' in default.stdout and 'cpu: 500m' not in default.stdout

missing_ingress = template('--set', 'ingress.enabled=true', check=False)
assert missing_ingress.returncode != 0 and 'ingress.className' in missing_ingress.stderr, missing_ingress.stderr
enabled_ingress = template(
    '--set', 'ingress.enabled=true',
    '--set-string', 'ingress.className=nginx',
    '--set-string', 'ingress.hosts[0].host=app.example.com',
    '--set-string', 'ingress.hosts[0].paths[0].path=/',
    '--set-string', 'ingress.hosts[0].paths[0].pathType=Prefix',
    '--set-string', 'ingress.tls[0].secretName=app-tls',
    '--set-string', 'ingress.tls[0].hosts[0]=app.example.com',
)
assert '\nkind: Ingress\n' in enabled_ingress.stdout
assert 'ingressClassName: nginx' in enabled_ingress.stdout
assert 'host: "app.example.com"' in enabled_ingress.stdout
assert 'secretName: app-tls' in enabled_ingress.stdout

for create, name, expected in [(True, '', 'test-my-app'), (True, 'custom', 'custom'), (False, 'existing', 'existing')]:
    result = template('--set', f'serviceAccount.create={str(create).lower()}',
                      '--set', f'serviceAccount.name={name}')
    docs = result.stdout.split('---')
    deployment = next(doc for doc in docs if '\nkind: Deployment\n' in doc)
    account = re.search(r'serviceAccountName: "?([^\s"]+)', deployment).group(1)
    assert account == expected, (account, expected)
    accounts = [doc for doc in docs if '\nkind: ServiceAccount\n' in doc]
    assert len(accounts) == int(create), accounts
    if create:
        assert re.search(r'\n  name: "?([^\s"]+)', accounts[0]).group(1) == account
invalid = template('--set', 'serviceAccount.create=false', check=False)
assert invalid.returncode != 0 and 'serviceAccount.name' in invalid.stderr, invalid.stderr
print('PASS: safe ingress/resource defaults, explicit ingress, ServiceAccounts, and invalid inputs')
