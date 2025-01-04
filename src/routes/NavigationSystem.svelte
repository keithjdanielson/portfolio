<script lang="ts">
	import HomeContent from './HomeContent.svelte';
	import AboutContent from './AboutContent.svelte';
	import WorkContent from './WorkContent.svelte';
	import SkillsContent from './SkillsContent.svelte';
	import ContactContent from './ContactContent.svelte';

	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let activeSection: string | null = null;
	let mainContainer: HTMLElement;
	let isAnimating = false;
	const NAV_HEIGHT = 48;

	const SCROLL_SENSITIVITY = 13; // Increase this number to require more scrolling
	let lastWheelTimestamp = 0;
	const SCROLL_COOLDOWN = 500; // Time in ms before accepting another scroll event

	const sections = [
		{ id: 'about', name: 'About Me', color: 'bg-one', content: AboutContent },
		{ id: 'work', name: 'Work', color: 'bg-two', content: WorkContent },
		{ id: 'skills', name: 'Skills', color: 'bg-three', content: SkillsContent },
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

		if (window.innerWidth <= 1024) {
			return;
		}

		// Get current timestamp
		const now = Date.now();

		// Accumulate scroll until threshold
		const scrollDelta = Math.abs(event.deltaY);

		// Only trigger if scroll is significant enough
		if (scrollDelta < SCROLL_SENSITIVITY) {
			return;
		}

		const direction = event.deltaY > 0 ? 'down' : 'up';
		const nextSection = getNextSection(direction);

		// Check if we've waited long enough since last scroll
		if (now - lastWheelTimestamp < SCROLL_COOLDOWN && nextSection !== null) {
			return;
		}

		if (nextSection !== null) {
			event.preventDefault();
			lastWheelTimestamp = now; // Record timestamp of this scroll
			toggleSection(nextSection);
		} else if (direction === 'up' && activeSection) {
			event.preventDefault();
			lastWheelTimestamp = now; // Record timestamp of this scroll
			animateToBottom(null);
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

	function toggleSection(sectionId: string) {
		if (activeSection === sectionId) {
			animateToBottom(null);
		} else {
			animateToTop(sectionId);
		}
	}

	onMount(() => {
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
		};
	});
</script>

<div class="bg-background relative min-h-screen overflow-hidden" bind:this={mainContainer}>
	<!-- Home Content -->
	<HomeContent />

	<!-- Section Cards -->
	{#each sections as section}
		<div
			id="card-{section.id}"
			class="absolute inset-x-0 min-h-screen {section.color} transform"
			style="transform: translateY(100vh);"
		>
			<div class="px-3 pt-12">
				<svelte:component this={section.content} />
			</div>
		</div>
	{/each}

	<!-- Navigation Items -->
	{#each sections as section}
		<div id="nav-{section.id}" class="absolute left-0 w-full {section.color} z-10">
			<div class="p-3">
				<button
					class="text-background font-headers block w-full text-left"
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
</style>
