.PHONY: install typecheck fetch-assets

install:
npm install

typecheck:
npm run typecheck

fetch-assets:
bash scripts/fetch-assets.sh
