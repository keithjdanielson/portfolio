// stores/layout.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const MOBILE_BREAKPOINT = 640;

function createLayoutStore() {
	const { subscribe, set } = writable({
		isMobile: false
	});

	function checkMobile() {
		if (browser) {
			set({ isMobile: window.innerWidth < MOBILE_BREAKPOINT });
		}
	}

	return {
		subscribe,
		init: () => {
			checkMobile();
			if (browser) {
				window.addEventListener('resize', checkMobile);
			}
		},
		cleanup: () => {
			if (browser) {
				window.removeEventListener('resize', checkMobile);
			}
		}
	};
}

export const layoutStore = createLayoutStore();
