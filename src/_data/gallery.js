const fs = require("fs");
const path = require("path");

// Dossier source des images dans ton repo
const SRC_DIR = path.join(process.cwd(), "src", "images", "galerie");

// extensions autorisées
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

module.exports = function() {
  if (!fs.existsSync(SRC_DIR)) return [];

  const files = fs.readdirSync(SRC_DIR)
    .filter(f => exts.has(path.extname(f).toLowerCase()))
    // tri par numéro dans le nom (001, 002, 12…)
    .sort((a, b) => {
      const na = parseInt((a.match(/\d+/) || ["0"])[0], 10);
      const nb = parseInt((b.match(/\d+/) || ["0"])[0], 10);
      if (na !== nb) return na - nb;
      return a.localeCompare(b);
    });

  // Chemins côté site + alt par numéro
  return files.map((file, i) => {
    const num = (file.match(/\d+/) || [""])[0] || String(i+1);
    return {
      src: `/images/galerie/${file}`,
      alt: `Photo ${num}`,
      num
    };
  });
};
