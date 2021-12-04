// https://colinhacks.com/essays/building-a-spa-with-nextjs
module.exports = {
	async rewrites() {
		return [
			{
				source: '/:any',
				destination: '/'
			}
		]
	}
}