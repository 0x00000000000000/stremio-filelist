const express = require("express");
const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");

const app = express();

const manifest = {
  id: 'com.strefdsafmio.torrentio.catalog.addon',
    version: '3.0.2',
    name: 'Torrent Cafdsagtalogs',
    description: 'Provides catgfdsgsdalogs for movies/series/anime based on top seeded torrents. Requires Kitsu addon for anime.',
    logo: `https://i.ibb.co/w4BnkC9/GwxAcDV.png`,
    background: `https://i.ibb.co/VtSfFP9/t8wVwcg.jpg`,
    types: [Type.MOVIE, Type.SERIES, Type.ANIME],
    resources: ['catalog'],
    catalogs: [
      {
        id: 'top-movies',
        type: Type.MOVIE,
        name: "Top seeded",
        pageSize: 20,
        extra: [{ name: 'genre', options: genres }, { name: 'skip' }],
        genres: genres
      },
      {
        id: 'top-series',
        type: Type.SERIES,
        name: "Top seeded",
        pageSize: 20,
        extra: [{ name: 'genre', options: genres }, { name: 'skip' }],
        genres: genres
      },
      {
        id: 'top-anime',
        type: Type.ANIME,
        name: "Top seeded",
        pageSize: 20,
        extra: [{ name: 'genre', options: genres }, { name: 'skip' }],
        genres: genres
      }
    ],
    behaviorHints: {
      // @TODO might enable configuration to configure providers
      configurable: false,
      configurationRequired: false
    }
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
