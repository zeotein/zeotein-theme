# Copies of themes deleted on 17 Nov 2026

Shopify cannot restore a deleted theme. This folder holds everything that could still be recovered.

## Whole themes (complete, verified)

| Folder | Theme | Files | As of |
|---|---|---:|---|
| `187740487893-full-copy-2026-11-14/` | Cacao LP updates 2026-11-05 (live 5 to 17 Nov) | 567 | 14 Nov 18:46 UTC |
| `187923202261-full-copy-2026-11-15/` | Live + script error fixes (Nov 10) | 567 | 15 Nov 05:13 UTC |

Both come from the snapshots Shopify's theme tool kept in its workspace; every file matches that workspace's md5 list
(`MD5SUMS.txt` in each folder). To reuse one: upload the folder as a theme zip (Online Store > Themes > Add theme > Upload zip
file), or copy single files from it.

## Later versions of some files (partial, fetched 17 Nov morning, before the deletions)

| Folder | Theme | Files |
|---|---|---:|
| `187740487893-cacao-lp-updates-2026-11-05/` | Cacao LP updates 2026-11-05 | 41 |
| `187734720725-homepage-cro-gift-lock/` | Homepage CRO and Compliance + gift lock (live 5 Nov) | 37 |
| `187923202261-live-script-error-fixes-nov10/` | Live + script error fixes (Nov 10) | 12 |
| `186296926421-zeotein-llc-custom-raf/` | Zeotein LLC - Custom (Raf), Rafael's draft | 3 |

JSON files fetched through the Admin API come back in Shopify's formatting (header comment, re-indented), so a few differ in
bytes from the stored file while holding the same data. Note: the current live theme (188199928021) is an exact copy of
187740487893 made 17 Nov 02:34 UTC plus the documented hotfix changes, so that theme's final state also survives in live.

## Not recoverable from anything we hold

Rafael's Horizon theme (186335789269) and its unedited copy (186382254293), the Vegan 30 stick layout (186848575701), the
pre-Rafael Cacao landing page (187649786069), Dawn Original (153876201685), and 87 files of Rafael's 186296926421 (his Black
Friday page and Cacao stick page, including `templates/product.cacao-stick.json`; names, sizes and checksums are listed in
`deleted-themes-inventory-2026-11-17.md`). The only other possible source is Rafael's own computer or code repository.

Full list of every file with sizes and sources: `deleted-themes-inventory-2026-11-17.md`.
