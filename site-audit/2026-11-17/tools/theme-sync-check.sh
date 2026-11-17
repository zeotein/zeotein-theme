# Theme sync check: what differs between two themes, ignoring formatting noise.
# Paste into the Shopify theme_bash tool, run against either theme. Every theme the sandbox has
# opened sits side by side under /workspace/themes/<id>, so both can be read from one call.
# Set A (reference, e.g. live or a fresh copy of live) and B (e.g. the Black Friday draft).
#
# CAUTION: a sandbox copy can be stale. Files changed through other channels (theme editor,
# Shopify CLI, GraphQL) after the sandbox was first opened are not in it. Before trusting a row,
# compare `md5sum <file>` with GraphQL `theme(id) { files(filenames: [...]) { checksumMd5 updatedAt } }`.
# Liquid/JS/CSS checksums match directly; JSON only matches when the file was saved from the sandbox.
A=188199928021
B=187825914069
cd /workspace/themes
nt() {
tr -d '\r' < "$1" | awk '{a[NR]=$0} END{n=NR; while(n>0 && a[n]=="") n--; for(i=1;i<=n;i++) print a[i]}' | sed 's/^[ \t]*//'
}
nj() {
awk 'f||/^\{/{f=1;print}' "$1" | jq -S . 2>/dev/null
}
mkdir -p /tmp/sync
(cd $A && find . -type f ! -name AGENTS.md | sort) > /tmp/sync/a.txt
(cd $B && find . -type f ! -name AGENTS.md | sort) > /tmp/sync/b.txt
echo "== only in A ($A)"
comm -23 /tmp/sync/a.txt /tmp/sync/b.txt
echo "== only in B ($B)"
comm -13 /tmp/sync/a.txt /tmp/sync/b.txt
echo "== in both, real differences (diff lines, file)"
comm -12 /tmp/sync/a.txt /tmp/sync/b.txt | while read f
do
cmp -s "$A/$f" "$B/$f" && continue
case "$f" in
*.json)
nj "$A/$f" > /tmp/sync/x
nj "$B/$f" > /tmp/sync/y
;;
*.png|*.jpg|*.jpeg|*.gif|*.webp|*.svg|*.woff|*.woff2|*.ttf|*.ico)
echo "binary  $f"
continue
;;
*)
nt "$A/$f" > /tmp/sync/x
nt "$B/$f" > /tmp/sync/y
;;
esac
n=$(diff /tmp/sync/x /tmp/sync/y | grep -c '^[<>]')
[ "$n" -gt 0 ] && echo "$n  $f"
done
echo "== done"
