#!/bin/bash
# Prepara las sesiones de Claude Code en la nube: dependencias y herramientas de IA del proyecto.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
pnpm install

# Las herramientas son ayuda, no requisito: si una falla, la sesión arranca igual.
install_tools() {
  claude plugin marketplace add addyosmani/agent-skills
  claude plugin marketplace add DietrichGebert/ponytail
  claude plugin install agent-skills@addy-agent-skills
  claude plugin install ponytail@ponytail
  uv tool install graphifyy
  "$HOME/.local/bin/graphify" install --platform claude
  npx -y skills add tt-a1i/archify -g -y
}
install_tools || echo "Aviso: no se pudieron instalar todas las herramientas de IA" >&2
