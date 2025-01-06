export function load({ url }) {
	// Add cache headers for static assets
	return {
		headers: {
			'Cache-Control': 'public, max-age=31536000'
		}
	};
}