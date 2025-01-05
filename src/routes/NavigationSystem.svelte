<script lang="ts">
	import HomeContent from './HomeContent.svelte';
	import AboutContent from './AboutContent.svelte';
	import WorkContent from './WorkContent.svelte';
	import ProjectsContent from './ProjectsContent.svelte';
	import ContactContent from './ContactContent.svelte';

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { goto } from '$app/navigation';

	let initialLoad = true;
	let activeSection: string | null = null;
	let mainContainer: HTMLElement;
	let isAnimating = false;
	const NAV_HEIGHT = 48;
	const SCROLL_ATTEMPTS_NEEDED = 1;

	let scrollNewSectionAttempts = 0;
	const SCROLL_SENSITIVITY = 13; // Increase this number to require more scrolling
	let lastWheelTimestamp = 0;
	const SCROLL_COOLDOWN = 500; // Time in ms before accepting another scroll event

	const sections = [
		{ id: 'about', name: 'About Me', color: 'bg-one', content: AboutContent },
		{ id: 'experience', name: 'Experience', color: 'bg-two', content: WorkContent },
		{ id: 'projects', name: 'Projects', color: 'bg-three', content: ProjectsContent },
		{ id: 'contact', name: 'Contact', color: 'bg-four', content: ContactContent }
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

		console.warn('scroll attempt hit: ', scrollNewSectionAttempts);
		if (scrollNewSectionAttempts < SCROLL_ATTEMPTS_NEEDED) {
			scrollNewSectionAttempts++;
			return;
		}
		scrollNewSectionAttempts = 0;

		const nextSection = getNextSection(direction);
		event.preventDefault();
		lastWheelTimestamp = now;

		if (nextSection) {
			toggleSection(nextSection);
		} else if (direction === 'up' && activeSection) {
			animateToBottom(null);
		}
	}

	function handleHomeScroll(direction: 'up' | 'down', now: number, event: WheelEvent) {
		const nextSection = getNextSection(direction);
		if (nextSection && now - lastWheelTimestamp >= SCROLL_COOLDOWN) {
			event.preventDefault();
			lastWheelTimestamp = now;
			toggleSection(nextSection);
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

		// Fade out home content if visible
		if (!activeSection) {
			tl.to('.home-content', {
				opacity: 0,
				duration: 0.3,
				ease: 'power2.inOut'
			});
		}

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

	function handleHashChange() {
		const hash = window.location.hash.slice(1);
		if (hash && sections.some((s) => s.id === hash)) {
			toggleSection(hash);
		}
	}

	function toggleSection(sectionId: string) {
		if (!initialLoad && activeSection === sectionId) {
			window.history.pushState(null, '', '#');
			animateToBottom(null);
		} else {
			window.history.pushState(null, '', `#${sectionId}`);
			animateToTop(sectionId);
		}
		initialLoad = false;
	}

	onMount(() => {
		const hash = window.location.hash.slice(1);
		if (hash && sections.some((s) => s.id === hash)) {
			initialLoad = true;
			toggleSection(hash);
		}

		window.addEventListener('hashchange', handleHashChange);
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
				navEl.style.transform = `translateY(${bottomPosition - (sections.length - index) * NAV_HEIGHT}px)`;
			}
			if (cardEl) {
				cardEl.style.transform = 'translateY(100vh)';
			}
		});

		// Add wheel event listener
		mainContainer.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			mainContainer.removeEventListener('wheel', handleWheel);
			window.removeEventListener('hashchange', handleHashChange);
		};
	});
</script>

<div class="relative min-h-screen bg-background" bind:this={mainContainer}>
	<!-- Home Content -->
	<HomeContent />

	<!-- Section Cards -->
	{#each sections as section}
		<div
			id="card-{section.id}"
			class="absolute inset-x-0 min-h-screen {section.color} transform"
			style="transform: translateY(100vh);"
		>
			<div class="card-content pt-12">
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
					on:click={() => toggleSection(section.id)}
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

	/* Add to your style block */
	:global(.card-content) {
		max-height: calc(100vh - 48px);
		overflow-y: auto;
		height: calc(100vh - 48px);
	}
</style>
