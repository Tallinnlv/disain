#!/usr/bin/env bash
# Manual FTP deploy of the Docusaurus build to disain.tallinn.ee.
# Usage:  ./deploy-ftp.sh HOST [REMOTE_WEBROOT]
# Prompts for the FTP password (user "velvet"); nothing is stored or echoed.
#
# Uploads only files whose CONTENT differs from what is on the server. Each
# build gives every file a fresh mtime, so lftp's size+time comparison re-sent
# everything; instead the fresh remote backup is compared byte-for-byte with
# build/ (rsync -c), so a changed file can't be skipped. New and changed files
# go up first, stale files are deleted last (no window with missing bundles).
set -euo pipefail

HOST="${1:?usage: ./deploy-ftp.sh HOST [REMOTE_WEBROOT]}"
REMOTE="${2:-/}"
USER_NAME="velvet"
REPO="$(cd "$(dirname "$0")" && pwd)"
STAMP="$(date +%Y-%m-%d-%H%M)"
BACKUP="$HOME/Desktop/disain-backup-$STAMP"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

cd "$REPO"

echo "== 1/6 main is checked out and current"
git status --porcelain | grep -v '^??' && { echo "uncommitted changes, stopping"; exit 1; }
git checkout -q main
git pull -q || echo "warning: pull failed (GitHub SSH timeout?), continuing with local main"
git log --oneline -1

echo "== 2/6 building (make sure no dev server is running)"
if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "something is listening on :3000, stop the dev server first"; exit 1
fi
corepack yarn build 2>&1 | grep -E 'SUCCESS|ERROR|Error' || true
[ -f build/index.html ] || { echo "build/index.html missing, stopping"; exit 1; }

echo "== 3/6 FTP password for $USER_NAME@$HOST"
read -r -s -p "password: " FTP_PASS; echo
export LFTP_PASSWORD="$FTP_PASS"

LFTP_SETTINGS="set ssl:verify-certificate no; set ftp:ssl-allow yes; set xfer:use-temp-file no;"

echo "== 4/6 backing up current remote $REMOTE to $BACKUP"
mkdir -p "$BACKUP"
lftp -u "$USER_NAME" --env-password "ftp://$HOST" -e "
$LFTP_SETTINGS
mirror --no-perms --verbose=0 $REMOTE $BACKUP;
bye"

echo "== 5/6 comparing build/ with the server copy"
# Copy into STAGE only files that are new or whose bytes differ from the backup.
# Never touch web.config: the server has its own (not readable over FTP, so it
# is missing from the backup), and it must not be uploaded over or deleted.
PROTECTED='^web\.config$'
rsync -rc --exclude='/web.config' --compare-dest="$BACKUP/" build/ "$STAGE/"
find "$STAGE" -type d -empty -delete
(cd "$BACKUP" && find . -type f | sed 's#^\./##' | grep -Ev "$PROTECTED" | sort) > "$STAGE.remote"
(cd build && find . -type f | sed 's#^\./##' | sort) > "$STAGE.local"
comm -23 "$STAGE.remote" "$STAGE.local" > "$STAGE.delete"
UPLOAD_COUNT="$(find "$STAGE" -type f 2>/dev/null | wc -l | tr -d ' ')"
DELETE_COUNT="$(wc -l < "$STAGE.delete" | tr -d ' ')"
echo "to upload: $UPLOAD_COUNT files ($(du -sh "$STAGE" | cut -f1))"
echo "to delete: $DELETE_COUNT files"
sed 's/^/  - /' "$STAGE.delete"

if [ "$UPLOAD_COUNT" = 0 ] && [ "$DELETE_COUNT" = 0 ]; then
  echo "server already matches build/, nothing to do"; exit 0
fi

echo "== 6/6 uploading"
read -r -p "backup done in $BACKUP. upload now? [y/N] " ok
[ "$ok" = "y" ] || { echo "aborted, nothing uploaded"; exit 0; }

DELETE_CMDS=""
while IFS= read -r f; do
  DELETE_CMDS+="rm -f \"${REMOTE%/}/$f\";"$'\n'
done < "$STAGE.delete"

lftp -u "$USER_NAME" --env-password "ftp://$HOST" -e "
$LFTP_SETTINGS
$( [ "$UPLOAD_COUNT" != 0 ] && echo "mirror --reverse --no-perms --verbose=1 $STAGE $REMOTE;" )
$DELETE_CMDS
bye"
rm -f "$STAGE.remote" "$STAGE.local" "$STAGE.delete"

unset LFTP_PASSWORD FTP_PASS
echo "done. check https://disain.tallinn.ee/ with a hard refresh (Cmd+Shift+R)."
echo "rollback: lftp -u velvet ftp://$HOST -e \"set xfer:use-temp-file no; mirror --reverse --delete --no-perms $BACKUP $REMOTE; bye\""
