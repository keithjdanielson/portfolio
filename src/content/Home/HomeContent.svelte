<script>
	import ComputerSvg from './ComputerSVG.svelte';
</script>

<header class="home-content inset-0 sm:absolute">
	<div class="hidden sm:block">
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
	</div>
	<div class="sm:hidden">
		<div class="flex justify-start lg:justify-around">
			<div class="px-4">
				<h1 class="text-pretty font-headers text-5xl tracking-tight" id="page-title">
					<span aria-label="Keith Danielson">Keith Danielson</span>
				</h1>
				<h2 class="text-pretty font-headers text-3xl text-background">full stack developer.</h2>
			</div>
		</div>
	</div>
</header>
