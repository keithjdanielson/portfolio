<script>
	import ComputerSvg from '../assets/ComputerSVG.svelte';
</script>

<main class="home-content absolute inset-0">
	<div class="flex justify-center p-16 lg:justify-around">
		<div class="px-4">
			<h1
				class="text-pretty font-headers text-7xl tracking-tight sm:text-9xl lg:text-7xl xl:text-8xl 2xl:text-9xl"
				id="page-title"
			>
				<span aria-label="Keith Danielson">Keith <br /> Danielson</span>,<br />
				full stack<br />
				developer.
			</h1>
		</div>
		<div class="mx-auto hidden w-[600px] shrink-0 lg:block xl:w-[700px]" aria-hidden="true">
			<ComputerSvg />
			<span id="computer-illustration" class="sr-only">Decorative computer illustration</span>
		</div>
	</div>
</main>

<a
	href="#page-title"
	class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4"
>
	Skip to main content
</a>
