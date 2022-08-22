/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
}

module.exports = (phase, { defaultConfig }) => {
  let develop = (process.env.BUILD_ENV !== undefined) ? process.env.BUILD_ENV : process.env.NODE_ENV;
	develop = (develop === 'development') ? 'staging' : develop;
  
	let production = (develop === 'production') ? false : true;

	return {
		...nextConfig,
		productionBrowserSourceMaps: production,
		env: {
			URL_WEB: 'http://localhost:5100/',
			URL_API: 'https://graphql.anilist.co/'
		},
		'fontawesome-svg-core': {
			license: 'free'
		}
	}
}