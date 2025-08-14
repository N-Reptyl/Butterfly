export default {
	content: [
    "./src/**/*.{njk,html,md,11ty.js}",
    "./src/**/*.js"
  ], 
	theme:{
		extend:{
			colors:{
				darkbg:"#0B1D3B",
				accent:"#3B9CFF"
			},
			fontFamily: {
				'roboto': ['Roboto'],
			}
		}
	},
	plugins: []
};
