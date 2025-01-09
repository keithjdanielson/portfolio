// lib/types/section.ts
import type { SvelteComponent, Component } from 'svelte';

export interface Section {
	id: 'about' | 'experience' | 'projects' | 'contact';
	name: string;
	color: string;
}

export interface SectionWithContent extends Section {
	// If you want to be more specific about the component type
	content: Component<SvelteComponent>;
}
