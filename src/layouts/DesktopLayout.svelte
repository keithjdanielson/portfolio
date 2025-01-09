<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import gsap from 'gsap';
	import HomeContent from '../content/Home/HomeContent.svelte';
	import AboutContent from '../content/About/AboutContent.svelte';
	import WorkContent from '../content/Experience/WorkContent.svelte';
	import ProjectsContent from '../content/Projects/ProjectsContent.svelte';
	import ContactContent from '../content/Contact/ContactContent.svelte';
	import { browser } from '$app/environment';

	import type { Section } from '$lib/types/section';

	export let data;

	let loading = true;

	let mainContainer: HTMLElement;
	let isAnimating = false;
	let activeSection: string | null = null;
	const NAV_HEIGHT = 48;
	const ANIMATION_DURATION = 0.5;

	let scrollNewSectionAttempts = 0;
	const SCROLL_SENSITIVITY = 13;
	let lastWheelTimestamp = 0;
	const SCROLL_COOLDOWN = 750;

	const sections = data.sections.map((section: Section) => ({
		...section,
		content: {
			about: AboutContent,
			experience: WorkContent,
			projects: ProjectsContent,
			contact: ContactContent
		}[section.id]
	}));

	function setImmediatePositions(activeSectionId: string | null) {
		if (!mainContainer) return;

		const bottomPosition = mainContainer.offsetHeight;
		const activeIndex = activeSectionId
			? sections.findIndex((s: Section) => s.id === activeSectionId)
			: -1;

		sections.forEach((section: Section, index: number) => {
			const sectionEl = document.getElementById(`section-${section.id}`);
			if (sectionEl) {
				if (activeSectionId && index <= activeIndex) {
					sectionEl.style.transform = `translateY(${index * NAV_HEIGHT}px)`;
				} else {
					sectionEl.style.transform = `translateY(${
						bottomPosition - (sections.length - index) * NAV_HEIGHT
					}px)`;
				}
			}
		});
	}

	// Your existing getNextSection function remains the same
	function getNextSection(direction: 'up' | 'down'): string | null {
		if (!activeSection) {
			return direction === 'down' ? sections[0].id : null;
		}

		const currentIndex = sections.findIndex((s: Section) => s.id === activeSection);
		if (direction === 'up') {
			return currentIndex > 0 ? sections[currentIndex - 1].id : null;
		} else {
			return currentIndex < sections.length - 1 ? sections[currentIndex + 1].id : null;
		}
	}

	async function navigateToSection(sectionId: string | null) {
		// If clicking current section, go up one
		if (sectionId === activeSection) {
			const previousSection = getNextSection('up');
			if (previousSection) {
				await goto(`/${previousSection}`);
				animateToTop(previousSection);
			} else {
				// If no previous section, go home
				await goto('/');
				animateToBottom(null);
			}
		}
		// If going to a new section
		else if (sectionId !== null) {
			await goto(`/${sectionId}`);
			animateToTop(sectionId);
		}
		// If going home
		else {
			await goto('/');
			animateToBottom(null);
		}
	}

	function handleWheel(event: WheelEvent) {
		if (isAnimating) return;

		const now = Date.now();
		const scrollDelta = Math.abs(event.deltaY);
		if (scrollDelta < SCROLL_SENSITIVITY) return;

		const direction = event.deltaY > 0 ? 'down' : 'up';
		const activeElement = activeSection
			? document.querySelector(`#section-${activeSection} .card-content`)
			: null;

		if (!activeElement) {
			handleHomeScroll(direction, now, event);
			return;
		}

		const { scrollTop, scrollHeight, clientHeight } = activeElement;
		const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1;
		const isAtTop = scrollTop === 0;

		if ((direction === 'down' && !isAtBottom) || (direction === 'up' && !isAtTop)) {
			return;
		}

		if (now - lastWheelTimestamp < SCROLL_COOLDOWN) return;

		const nextSection = getNextSection(direction);
		lastWheelTimestamp = now;

		if (nextSection) {
			scrollNewSectionAttempts = 0;
			event.preventDefault();
			navigateToSection(nextSection);
		} else if (direction === 'up' && activeSection) {
			event.preventDefault();
			navigateToSection(null);
		}
	}

	function handleHomeScroll(direction: 'up' | 'down', now: number, event: WheelEvent) {
		const nextSection = getNextSection(direction);
		if (nextSection && now - lastWheelTimestamp >= SCROLL_COOLDOWN) {
			event.preventDefault();
			lastWheelTimestamp = now;
			navigateToSection(nextSection);
		}
	}

	function handleResize() {
		setImmediatePositions(activeSection);
	}

	function animateToTop(sectionId: string) {
		if (isAnimating) return;
		isAnimating = true;

		const clickedIndex = sections.findIndex((s: Section) => s.id === sectionId);
		const tl = gsap.timeline({
			onComplete: () => {
				isAnimating = false;
			}
		});

		const bottomPosition = mainContainer?.offsetHeight || 0;

		sections.forEach((section: Section, index: number) => {
			const sectionEl = `#section-${section.id}`;

			if (index <= clickedIndex) {
				// Move to top
				tl.to(
					sectionEl,
					{
						// Add NAV_HEIGHT offset for the active section
						y: index * NAV_HEIGHT,
						duration: ANIMATION_DURATION,
						ease: 'power2.inOut'
					},
					'start'
				);
			} else {
				// Keep at bottom
				const bottomY = bottomPosition - (sections.length - index) * NAV_HEIGHT;
				tl.to(
					sectionEl,
					{
						y: bottomY,
						duration: ANIMATION_DURATION,
						ease: 'power2.inOut'
					},
					'start'
				);
			}
		});

		activeSection = sectionId;
	}

	function animateToBottom(sectionId: string | null) {
		if (isAnimating) return;
		isAnimating = true;

		const tl = gsap.timeline({
			onComplete: () => {
				isAnimating = false;
			}
		});

		const bottomPosition = mainContainer?.offsetHeight || 0;

		sections.forEach((section: Section, index: number) => {
			const navYPosition = bottomPosition - (sections.length - index) * NAV_HEIGHT;
			const sectionEl = `#section-${section.id}`;

			if (section.id === sectionId) {
				tl.to(
					sectionEl,
					{
						y: 0,
						duration: ANIMATION_DURATION,
						ease: 'power2.inOut'
					},
					'start'
				);
			} else {
				tl.to(
					sectionEl,
					{
						y: navYPosition,
						duration: ANIMATION_DURATION,
						ease: 'power2.inOut'
					},
					'start'
				);
			}
		});

		activeSection = sectionId;
	}

	onMount(() => {
		const currentPath = $page.url.pathname;
		const sectionId = currentPath.slice(1);
		// Set initial positions immediately without animation
		if (sectionId && sections.some((s: Section) => s.id === sectionId)) {
			activeSection = sectionId;
			setImmediatePositions(sectionId);
		} else {
			setImmediatePositions(null);
		}

		loading = false;
		window.addEventListener('resize', handleResize);
		mainContainer?.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			window.removeEventListener('resize', handleResize);
			mainContainer?.removeEventListener('wheel', handleWheel);
		};
	});
</script>

<svelte:head>
	<title>Keith Danielson</title>
	<meta
		name="description"
		content="Full-stack developer specializing in modern web technologies."
	/>
	<meta property="og:title" content="Keith Danielson" />
	<meta
		property="og:description"
		content="Full-stack developer specializing in modern web technologies."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/KeithDanielsonIcon.png" />
	<link rel="icon" type="image/png" href="/KeithDanielsonIcon.png" />
</svelte:head>

<div
	class="relative min-h-dvh bg-background"
	bind:this={mainContainer}
	style="visibility: {loading ? 'hidden' : 'visible'}"
>
	<!-- Home Content -->
	<div class="home-content">
		<HomeContent />
	</div>

	<!-- Combined Section Elements -->
	{#each sections as section, index}
		<div id="section-{section.id}" class="section absolute inset-x-0">
			<!-- Nav part -->
			<div class="w-full {section.color} z-10">
				<div class="p-3">
					<button
						class="block w-full text-left font-secondary text-background"
						on:click={() => navigateToSection(section.id)}
					>
						{section.name}
					</button>
				</div>
			</div>

			<!-- Content part -->
			<div class={section.color}>
				<div
					class="card-content overflow-y-auto"
					style="height: calc(100dvh - {NAV_HEIGHT * sections.length}px);"
				>
					<svelte:component this={section.content} />
				</div>
			</div>
		</div>
	{/each}
</div>
