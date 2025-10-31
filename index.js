const express = require("express");
const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");

const app = express();

const manifest = {
  id: "org.filelist.stremio",
  version: "1.0.0",
  name: "Filelist Addon",
  logo: "https://www.stremio.com/website/stremio-logo-small.png",
  description: "Addon Stremio care aduce torrente de pe filelist.io",
  types: ["movie", "series"],
  resources: ["stream"],
  catalogs: [],
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
  const imdbId = (id || "").replace("tt", "");
  const username = process.env.FILELIST_USER;
  const passkey = process.env.FILELIST_PASSKEY;

  if (!username || !passkey) {
    console.error("Missing FILELIST_USER or FILELIST_PASSKEY env variables.");
    return { streams: [] };
  }

  try {
    const res = await axios.get("https://filelist.io/api.php", {
      params: { username, passkey, imdb: imdbId }
    });

    const torrents = res.data || [];
    const streams = (Array.isArray(torrents) ? torrents : []).map(item => ({
      name: "Filelist",
      title: `${item.name} [${item.size || "?"}]`,
      sources: [
        `magnet:?xt=urn:btih:${item.info_hash}&dn=${encodeURIComponent(item.name)}`
      ]
    }));

    return { streams };
  } catch (e) {
    console.error("Eroare Filelist API:", e.message || e);
    return { streams: [] };
  }
});

const addonInterface = builder.getInterface();

app.get("/manifest.json", (req, res) => res.json(addonInterface.manifest));
app.get("/:resource/:type/:id.json", (req, res) => {
  addonInterface.get(req.params).then(resp => res.json(resp));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Addon Filelist live pe portul ${port}`);
});
