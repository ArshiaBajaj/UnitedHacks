#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/backend"
if [ ! -d venv ]; then
  python3 -m venv venv
  source venv/bin/activate
  PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 pip install -r requirements.txt
else
  source venv/bin/activate
fi
uvicorn main:app --reload --host 0.0.0.0 --port 8000
