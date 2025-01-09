<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import HomeContent from '../content/Home/HomeContent.svelte';
	import AboutContent from '../content/About/AboutContent.svelte';
	import WorkContent from '../content/Experience/WorkContent.svelte';
	import ProjectsContent from '../content/Projects/ProjectsContent.svelte';
	import ContactContent from '../content/Contact/ContactContent.svelte';

	import type { Section } from '$lib/types/section';

	import { slide } from 'svelte/transition';

	export let data;
	let isMenuOpen = false;

	const sections = data.sections.map((section: Section) => ({
		...section,
		content: {
			about: AboutContent,
			experience: WorkContent,
			projects: ProjectsContent,
			contact: ContactContent
		}[section.id]
	}));

	$: currentSection = $page.url.pathname.slice(1);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function navigateToSection(sectionId: string | null) {
		isMenuOpen = false;
		if (sectionId) {
			goto(`/${sectionId}`);
		} else {
			goto('/');
		}
	}
</script>

<div class="min-h-dvh bg-one">
	<main class="flex min-h-dvh flex-col">
		<section id="home" class="bg-one pb-4 pt-8 text-white">
			<HomeContent />
		</section>
		<div class="mx-4 h-[1px] rounded-lg bg-background opacity-20"></div>
		{#each sections as section}
			<section
				id={section.id}
				class="min-h-dvh w-full {section.mobileColor ? section.mobileColor : section.color}"
			>
				<h3 class="w-full p-4 font-secondary text-2xl text-background">
					{section.name}
				</h3>
				<svelte:component this={section.content} />
			</section>
		{/each}
	</main>
</div>
