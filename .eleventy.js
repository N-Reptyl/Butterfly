const { DateTime } = require("luxon");
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy({ "public/images": "images" });
	
	eleventyConfig.addShortcode("year", () => new Date().getFullYear());
	
	eleventyConfig.addFilter("isActive", function (slug, currentSlug) {
		return slug === currentSlug ? "active" : "";
	});
	
	// Filtre date FR courte
	eleventyConfig.addFilter("dateFR", (value, opts={ month:"long", day:"2-digit" }) => {
		const d = (value instanceof Date) ? value : new Date(value);
		return d.toLocaleDateString("fr-FR", opts);
	});
	
	// Collection concerts (tri décroissant)
	eleventyConfig.addCollection("concerts", api => {
		return api.getFilteredByGlob("src/concerts/*.md")
		.sort((a,b) => new Date(b.data.date) - new Date(a.data.date));
	});
	
	// Séparation à venir / passés selon toutes les dates
	eleventyConfig.addCollection("concertsUpcoming", api => {
		const now = new Date();
		return api.getFilteredByGlob("src/concerts/*.md")
		.filter(p => {
			if (!Array.isArray(p.data.dates)) return false;
			return p.data.dates.some(d => new Date(d.start) >= now);
		})
		// Trie par première date à venir
		.sort((a, b) => {
			const nextDateA = a.data.dates
			.map(d => new Date(d.start))
			.filter(d => d >= now)
			.sort((d1, d2) => d1 - d2)[0];
			const nextDateB = b.data.dates
			.map(d => new Date(d.start))
			.filter(d => d >= now)
			.sort((d1, d2) => d1 - d2)[0];
			return nextDateA - nextDateB;
		});
	});
	
	eleventyConfig.addCollection("concertsPast", api => {
		const now = new Date();
		return api.getFilteredByGlob("src/concerts/*.md")
		.filter(p => {
			if (!Array.isArray(p.data.dates)) return false;
			return p.data.dates.every(d => new Date(d.start) < now);
		})
		// Trie par dernière date passée (plus récente d'abord)
		.sort((a, b) => {
			const lastDateA = a.data.dates
			.map(d => new Date(d.start))
			.sort((d1, d2) => d2 - d1)[0];
			const lastDateB = b.data.dates
			.map(d => new Date(d.start))
			.sort((d1, d2) => d2 - d1)[0];
			return lastDateB - lastDateA;
		});
	});
	
	
	eleventyConfig.addCollection("associes", api =>
		api.getFilteredByGlob("src/associes/*.md")
		.sort((a,b) => (a.data.order ?? 0) - (b.data.order ?? 0))
	);
	
	eleventyConfig.addCollection("choristes", (api) =>
		api.getFilteredByGlob("src/choristes/*.md")
		.sort((a,b) => (a.data.order ?? 999) - (b.data.order ?? 999))
	);
	
	// Filtre date: {{ iso | date("EEEE d MMMM yyyy", "fr") }}
	eleventyConfig.addFilter("date", (iso, format = "DDD", locale = "fr") => {
		if (!iso) return "";
		// Accepte ISO, Date, ou timestamp
		let dt = typeof iso === "string"
		? DateTime.fromISO(iso, { zone: "local" })
		: DateTime.fromJSDate(iso, { zone: "local" });
		
		if (!dt.isValid) return "";
		return dt.setLocale(locale).toFormat(format);
	});
	
	eleventyConfig.addFilter("dirImages", (publicDir) => {
		if (!publicDir || typeof publicDir !== "string") return [];
		
		// normalise le chemin disque depuis le chemin public
		const rel = publicDir.replace(/^\/+/, ""); // enlève le / initial
		const abs = path.join(process.cwd(), "public", rel);
		
		if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) {
			// dossier introuvable → renvoie []
			return [];
		}
		
		// liste des fichiers
		const files = fs.readdirSync(abs)
		.filter(file => /\.(jpe?g|png|gif|webp|avif)$/i.test(file))
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
		
		// on renvoie les chemins publics (pour les <img src="...">)
		return files.map(file => {
			// garantit un seul slash
			return "/" + path.posix.join(rel.split(path.sep).join("/"), file);
		});
	});
	
	eleventyConfig.addPassthroughCopy({ "src/images": "images" });
	eleventyConfig.addPassthroughCopy({ "src/files": "files" });
	return {
		dir: {
			input: "src",
			includes: "_includes",
			data: "_data",
			output: "dist"
		},
		templateFormats: ["html", "md", "njk", "ico"],
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
		passthroughFileCopy: true
	};
};
