"""Exercise the alert documented in the skill using real promtool counter fixtures."""
from pathlib import Path
import re
import shutil
import subprocess
import tempfile

root = Path(__file__).resolve().parents[1]
promtool = shutil.which('promtool')
if not promtool:
    raise SystemExit('promtool is required; see tests/README.md')
skill = (root / 'skills/monitoring-and-alerting/SKILL.md').read_text(encoding='utf-8')
rule = re.search(r'### Alerting rules example\s*```yaml\n(.*?)```', skill, re.S)[1]
fixtures = '''rule_files: [rules.yml]
evaluation_interval: 1m
tests:
  - interval: 1m
    input_series:
      - series: 'http_requests_total{service="healthy",status="200",instance="a"}'
        values: '0+100x15'
      - series: 'http_requests_total{service="healthy",status="500",instance="b"}'
        values: '0+2x15'
      - series: 'http_requests_total{service="bad",status="200",instance="a"}'
        values: '0+80x15'
      - series: 'http_requests_total{service="bad",status="503",instance="b"}'
        values: '0+20x15'
      - series: 'http_requests_total{service="no-errors",status="200",instance="a"}'
        values: '0+50x15'
      - series: 'http_requests_total{service="idle",status="200",instance="a"}'
        values: '0+0x15'
      - series: 'http_requests_total{service="idle",status="500",instance="b"}'
        values: '0+0x15'
    alert_rule_test:
      - eval_time: 10m
        alertname: HighErrorRate
        exp_alerts:
          - exp_labels: {service: bad, severity: critical}
            exp_annotations: {summary: "HTTP 5xx fraction above 5% on bad"}
'''
with tempfile.TemporaryDirectory() as directory:
    tmp = Path(directory)
    (tmp / 'rules.yml').write_text(rule, encoding='utf-8')
    (tmp / 'tests.yml').write_text(fixtures, encoding='utf-8')
    subprocess.run([promtool, 'test', 'rules', 'tests.yml'], cwd=tmp, check=True)
    # The same fixtures must reject the old status/instance label-matching bug.
    broken = re.sub(r'        expr: \|\n.*?        for:',
                    '        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05\n        for:',
                    rule, flags=re.S)
    assert broken != rule, 'mutation did not change the rule'
    (tmp / 'rules.yml').write_text(broken, encoding='utf-8')
    result = subprocess.run([promtool, 'test', 'rules', 'tests.yml'], cwd=tmp, capture_output=True, text=True)
    assert result.returncode != 0 and 'FAILED' in result.stdout + result.stderr, result.stdout + result.stderr
print('PASS: healthy, high-error, absent-5xx and idle services; old ratio mutation rejected')
