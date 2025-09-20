# 🎬 Filelist Stremio Addon

Addon Stremio care integrează **Filelist.io** ca provider de torrente.

## 🚀 Deploy pe Railway

1. Creează un repo GitHub și adaugă aceste fișiere.
2. În Railway → New Project → Deploy from GitHub repo.
3. Adaugă variabilele de mediu:
   - `FILELIST_USER` = username Filelist
   - `FILELIST_PASSKEY` = passkey Filelist
4. Railway va genera un URL de forma:
   ```
   https://stremio-filelist.up.railway.app/manifest.json
   ```
5. Adaugă linkul în Stremio (Add-ons → Add addon via URL).
