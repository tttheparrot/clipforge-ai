#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js 20+ from https://nodejs.org/"
  exit 1
fi
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env. Add OPENAI_API_KEY to enable AI highlight selection."
fi
if [ ! -d node_modules ]; then npm install; fi
echo "Keep this terminal open, then visit http://localhost:3000"
npm start
