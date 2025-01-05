module.exports = {
	async headers() {
		return [
			{
				source: '/:path*.js',
				headers: [
					{
						key: 'Content-Type',
						value: 'application/javascript',
					},
				],
			},
			{
				// Also handle JavaScript modules specifically
				source: '/:path*.mjs',
				headers: [
					{
						key: 'Content-Type',
						value: 'application/javascript',
					},
				],
			},
			{
				// Handle JavaScript modules with custom extensions
				source: '/:path*.module.js',
				headers: [
					{
						key: 'Content-Type',
						value: 'application/javascript',
					},
				],
			}
		]
	},
}