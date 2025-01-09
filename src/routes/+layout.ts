export const prerender = true;

export const load = async ({ url }) => {
	const currentPath = url.pathname;
	const sectionId = currentPath.slice(1);

	return {
		currentSection: sectionId || null,
		sections: [
			{
				id: 'about',
				name: 'About Me',
				color: 'bg-one'
			},
			{
				id: 'experience',
				name: 'Experience',
				color: 'bg-two'
			},
			{
				id: 'projects',
				name: 'Projects',
				color: 'bg-three',
				mobileColor: 'bg-two'
			},
			{
				id: 'contact',
				name: 'Contact',
				color: 'bg-four'
			}
		]
	};
};
