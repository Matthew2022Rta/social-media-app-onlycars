# SBD Final Project (Solo)
English Sentence Boundary Detection (SBD): baselines (B0/B1/Punkt) and a supervised model (S1).

## Quickstart
```bash
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\Activate
pip install -U pip
pip install -r requirements.txt
python -m tools.eval.sbd_eval --help

# social-media-app-onlycars
