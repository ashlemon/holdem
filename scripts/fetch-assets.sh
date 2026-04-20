#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/assets/bundles/game/textures/cards"
mkdir -p "$OUT_DIR"

SUITS=(S H D C)
RANKS=(A 2 3 4 5 6 7 8 9 10 J Q K)

# 说明：Wikimedia 具体文件名偶尔会调整，如下载失败请先到
# https://commons.wikimedia.org/wiki/Category:SVG_English_pattern_playing_cards
# 确认文件 URL，然后按需调整下面的 BASE_URL/文件名规则。
BASE_URL="https://upload.wikimedia.org/wikipedia/commons"

for suit in "${SUITS[@]}"; do
  for rank in "${RANKS[@]}"; do
    file_name="${rank}${suit}.svg"
    # Wikimedia 使用 hash 分桶目录（如 8/8a/），实际目录可能变化，失败时请按注释调整。
    url="$BASE_URL/8/8a/${file_name}"
    target="$OUT_DIR/$file_name"
    echo "Downloading $file_name"
    if ! curl -fsSL "$url" -o "$target"; then
      echo "WARN: $url 下载失败，请按脚本注释调整 URL 后重试。" >&2
      rm -f "$target"
    fi
  done
done

echo "Done. Cards are in $OUT_DIR"
