#!/usr/bin/env bash
set -euo pipefail

echo "ApoioBusinessCentral repository check"
test -f README.md
test -f .env.example
test -d docs
test -d services/integration-api
test -d knowledge-base/templates
echo "OK"
