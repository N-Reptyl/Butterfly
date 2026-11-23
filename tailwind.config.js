export default {
	content: [
    "./src/**/*.{njk,html,md,11ty.js}",
    "./src/**/*.js"
  ], 
	theme:{
		extend:{
			colors: {
        primary: '#255147',     // Vert foncé (boutons, fonds)
		primary_hover: '#477268',
        secondary: '#3a7f6f',   // Vert clair (accents, dégradés)
		secondary_hover: '#3f937f',
		third: '#8FD0BF',       // Vert très clair (fonds, accents)
		whitish: '#fffff6',
        accent: '#183831',      // Vert très sombre (titres, textes)
        light: '#ffffff',       // Blanc (textes clairs)
        dark: '#0B1D3B',        // Bleu nuit utilisé pour ombres / textes
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle, #3a7f6f 0%, #255147 60%)',
		'white-gradient': 'radial-gradient(circle, #ffffff 0%, #f0f0f0 60%)',
      },
			fontFamily: {
				'roboto': ['Roboto'],
			}
		}
	},
	plugins: []
};
