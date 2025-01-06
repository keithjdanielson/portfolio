<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import gsap from 'gsap';
	import HomeContent from '../content/HomeContent.svelte';
	import AboutContent from '../content/AboutContent.svelte';
	import WorkContent from '../content/WorkContent.svelte';
	import ProjectsContent from '../content/ProjectsContent.svelte';
	import ContactContent from '../content/ContactContent.svelte';

	let mainContainer: HTMLElement;
	let isAnimating = false;
	let activeSection: string | null = null;
	const NAV_HEIGHT = 48;

	let scrollNewSectionAttempts = 0;
	const SCROLL_SENSITIVITY = 13;
	let lastWheelTimestamp = 0;
	const SCROLL_COOLDOWN = 750;

	const sections = [
		{
			id: 'about',
			name: 'About Me',
			color: 'bg-one',
			content: AboutContent
		},
		{
			id: 'experience',
			name: 'Experience',
			color: 'bg-two',
			content: WorkContent
		},
		{
			id: 'projects',
			name: 'Projects',
			color: 'bg-three',
			content: ProjectsContent
		},
		{
			id: 'contact',
			name: 'Contact',
			color: 'bg-four',
			content: ContactContent
		}
	];

	function getNextSection(direction: 'up' | 'down'): string | null {
		if (!activeSection) {
			return direction === 'down' ? sections[0].id : null;
		}

		const currentIndex = sections.findIndex((s) => s.id === activeSection);
		if (direction === 'up') {
			return currentIndex > 0 ? sections[currentIndex - 1].id : null;
		} else {
			return currentIndex < sections.length - 1 ? sections[currentIndex + 1].id : null;
		}
	}

	// async function navigateToSection(sectionId: string | null) {
	// 	if (sectionId === null) {
	// 		await goto('/');
	// 		animateToBottom(null);
	// 	} else {
	// 		await goto(`/${sectionId}`);
	// 		animateToTop(sectionId);
	// 	}
	// }

	// IF WE CLICK THE SECTION NAME WE ARE ON, WE GO HOME

	// async function navigateToSection(sectionId: string | null) {
	// 	// If we're clicking the active section, treat it as going home
	// 	if (sectionId === activeSection) {
	// 		await goto('/');
	// 		animateToBottom(null);
	// 	} else {
	// 		// Otherwise proceed with normal section navigation
	// 		if (sectionId === null) {
	// 			await goto('/');
	// 			animateToBottom(null);
	// 		} else {
	// 			await goto(`/${sectionId}`);
	// 			animateToTop(sectionId);
	// 		}
	// 	}
	// }

	// IF WE CLICK THE SECTION NAME WE ARE ON, WE GO UP A SECTION
	async function navigateToSection(sectionId: string | null) {
		// If we're clicking the active section, go up one
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
		} else {
			// Normal navigation
			if (sectionId === null) {
				await goto('/');
				animateToBottom(null);
			} else {
				await goto(`/${sectionId}`);
				animateToTop(sectionId);
			}
		}
	}

	function handleWheel(event: WheelEvent) {
		if (isAnimating) return;

		const now = Date.now();
		const scrollDelta = Math.abs(event.deltaY);
		if (scrollDelta < SCROLL_SENSITIVITY) return;

		const direction = event.deltaY > 0 ? 'down' : 'up';
		const activeElement = activeSection
			? document.querySelector(`#card-${activeSection} .card-content`)
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

	function animateToTop(sectionId: string) {
		if (isAnimating) return;
		isAnimating = true;

		const clickedIndex = sections.findIndex((s) => s.id === sectionId);
		const tl = gsap.timeline({
			onComplete: () => {
				isAnimating = false;
			}
		});

		// Animate sections to their new positions
		sections.forEach((section, index) => {
			// Nav button
			const navEl = `#nav-${section.id}`;
			// Content card
			const cardEl = `#card-${section.id}`;

			if (index <= clickedIndex) {
				// Move to top
				tl.to(
					navEl,
					{
						y: index * NAV_HEIGHT,
						duration: 0.5,
						ease: 'power2.inOut'
					},
					'<'
				);

				// If it's the active card, slide it up to fill the screen
				if (index === clickedIndex) {
					tl.to(
						cardEl,
						{
							y: 0,
							duration: 0.5,
							ease: 'power2.inOut'
						},
						'<'
					);
				} else {
					// Stack other cards above
					tl.to(
						cardEl,
						{
							y: index * NAV_HEIGHT,
							duration: 0.5,
							ease: 'power2.inOut'
						},
						'<'
					);
				}
			} else {
				// Move to bottom
				const bottomPosition = mainContainer.offsetHeight - (sections.length - index) * NAV_HEIGHT;
				tl.to(
					navEl,
					{
						y: bottomPosition,
						duration: 0.5,
						ease: 'power2.inOut'
					},
					'<'
				);

				// Keep cards below
				tl.to(
					cardEl,
					{
						y: '100vh',
						duration: 0.5,
						ease: 'power2.inOut'
					},
					'<'
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

		if (!sectionId) {
			// Going back to home
			tl.to('.home-content', {
				opacity: 1,
				duration: 0.3,
				ease: 'power2.inOut'
			});
		}

		// Move all sections to bottom
		sections.forEach((section, index) => {
			const navYPosition = bottomPosition - (sections.length - index) * NAV_HEIGHT;

			// Move nav buttons
			tl.to(
				`#nav-${section.id}`,
				{
					y: navYPosition,
					duration: 0.5,
					ease: 'power2.inOut'
				},
				'<'
			);

			// Move cards
			if (section.id === sectionId) {
				// If this is the target section, bring it into view
				tl.to(
					`#card-${section.id}`,
					{
						y: 0,
						duration: 0.5,
						ease: 'power2.inOut'
					},
					'<'
				);
			} else {
				// Otherwise, move it out of view
				tl.to(
					`#card-${section.id}`,
					{
						y: '100vh',
						duration: 0.5,
						ease: 'power2.inOut'
					},
					'<'
				);
			}
		});

		activeSection = sectionId;
	}

	onMount(() => {
		const currentPath = $page.url.pathname;
		const sectionId = currentPath.slice(1); // Remove leading slash

		if (sectionId && sections.some((s) => s.id === sectionId)) {
			activeSection = sectionId;
			animateToTop(sectionId);
		}

		// Initialize home content to visible
		const homeContent = document.querySelector('.home-content');
		if (homeContent) {
			gsap.set(homeContent, { opacity: 1 });
		}

		// Initialize positions
		const bottomPosition = mainContainer?.offsetHeight || 0;
		sections.forEach((section, index) => {
			const navEl = document.getElementById(`nav-${section.id}`);
			const cardEl = document.getElementById(`card-${section.id}`);
			if (navEl) {
				navEl.style.transform = `translateY(${
					bottomPosition - (sections.length - index) * NAV_HEIGHT
				}px)`;
			}
			if (cardEl) {
				cardEl.style.transform = 'translateY(100vh)';
			}
		});

		// Add wheel event listener
		mainContainer?.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
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

<div class="relative min-h-dvh bg-background" bind:this={mainContainer}>
	<!-- Home Content -->
	<div class="home-content">
		<HomeContent />
	</div>

	<!-- Section Cards -->
	{#each sections as section, index}
		<div
			id="card-{section.id}"
			class="absolute inset-x-0 min-h-screen {section.color} transform"
			style="transform: translateY(100vh);"
		>
			<div class="card-content pb-16 sm:pb-0" style="padding-top: {(index + 1) * 48}px;">
				<svelte:component this={section.content} />
			</div>
		</div>
	{/each}

	<!-- Navigation Items -->
	{#each sections as section}
		<div id="nav-{section.id}" class="absolute left-0 w-full {section.color} z-10">
			<div class="p-3">
				<button
					class="block w-full text-left font-secondary text-background"
					on:click={() => navigateToSection(section.id)}
				>
					{section.name}
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	:global(body) {
		overflow: hidden;
	}

	:global(.card-content) {
		max-height: calc(100dvh - 48px);
		height: calc(100dvh - 48px);
		overflow-y: auto;
		/* Add padding to ensure content is reachable */
		/* padding-bottom: max(env(safe-area-inset-bottom), 24px); */
	}
</style>
