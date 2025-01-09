<script lang="ts">
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { layoutStore } from '$lib/stores/layout';
	import DesktopLayout from '../layouts/DesktopLayout.svelte';
	import MobileLayout from '../layouts/MobileLayout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: if (browser) {
		if ($layoutStore.isMobile) {
			document.documentElement.style.scrollBehavior = 'smooth';
			document.body.style.overflowY = 'auto';
		} else {
			document.documentElement.style.scrollBehavior = 'auto';
			document.body.style.overflow = 'hidden';
		}
	}

	onMount(() => {
		layoutStore.init();
	});

	onDestroy(() => {
		layoutStore.cleanup();
		// Reset styles on cleanup
		if (browser) {
			document.documentElement.style.scrollBehavior = '';
			document.body.style.overflow = '';
		}
	});
</script>

<svelte:window on:resize={() => layoutStore.init()} />

{#if $layoutStore.isMobile}
	<MobileLayout {data} />
{:else}
	<DesktopLayout {data} />
{/if}
