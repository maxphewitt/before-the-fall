#!/usr/bin/env bash
# Before the Fall — safe pre-restructure backup
# Usage: ./backup-platform.sh /path/to/platform-repo
# Creates THREE independent restore points: a git tag, a backup branch, and an off-git zip.

set -euo pipefail

REPO="${1:-$(pwd)}"
STAMP="$(date +%Y-%m-%d)"
TAG="backup-pre-restructure-${STAMP}"
BRANCH="backup/pre-restructure-${STAMP}"

cd "$REPO"

if [ ! -d .git ]; then
  echo "ERROR: $REPO is not a git repository. Pass the repo path as the first argument."
  exit 1
fi

echo "==> Repo:   $REPO"
echo "==> HEAD:   $(git rev-parse --short HEAD)  ($(git rev-parse --abbrev-ref HEAD))"
echo "==> Tag:    $TAG"
echo "==> Branch: $BRANCH"
echo

# 1. Tag the exact current commit (idempotent-ish; will error if tag exists)
git tag "$TAG"

# 2. Create a backup branch pointing at current HEAD (without switching to it)
git branch "$BRANCH"

# 3. Push both to origin (remove these two lines if you want a local-only backup)
git push origin "$TAG"
git push origin "$BRANCH"

# 4. Off-git zip stored one level up from the repo
REPO_NAME="$(basename "$REPO")"
ZIP_PATH="../${REPO_NAME}-backup-${STAMP}.zip"
( cd .. && zip -r "${REPO_NAME}-backup-${STAMP}.zip" "$REPO_NAME" \
    -x "*/node_modules/*" "*/.next/*" "*/.git/*" >/dev/null )

echo
echo "==> Done."
echo "    Git tag:    $TAG"
echo "    Git branch: $BRANCH"
echo "    Zip:        $(cd .. && pwd)/${REPO_NAME}-backup-${STAMP}.zip"
echo
echo "Restore later with:  git checkout $TAG"
echo "Move the zip somewhere off-machine (iCloud/Drive) for a fourth copy."
