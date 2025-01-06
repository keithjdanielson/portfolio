<script>
	import projects from '$lib/data/projects';
</script>

<div class="overflow-y-visible sm:px-8">
	<ul role="list" class="grid grid-cols-1 gap-x-4 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-2 xl:gap-x-8">
		{#each projects as project}
			<li class="relative bg-two p-8 sm:rounded-lg">
				<h2 class="flex justify-between pb-2 font-headers text-3xl text-background sm:text-4xl">
					<span>{project.name}</span>
					<span class="font-light">{project.date}</span>
				</h2>
				<div
					class="group overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-background focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
				>
					<a
						href={project.url}
						target="_blank"
						rel="noopener noreferrer"
						on:click={(e) => {
							console.log('URL:', project.url);
						}}
					>
						<img
							src={project.imagePath}
							alt=""
							class="aspect-[8/4] object-cover group-hover:opacity-90"
						/>
					</a>
				</div>
				<p class="pointer-events-none mt-2 block font-secondary text-xl text-background">
					{project.description}
				</p>
				<div class="pt-2">
					{#each project.skills as skill}
						<div
							class="mr-1 mt-1 inline-flex cursor-default items-center rounded-full bg-three px-2 py-1 text-sm text-white hover:bg-one"
						>
							<span class="font-secondary text-lg">{skill}</span>
						</div>
					{/each}
				</div>
			</li>
		{/each}

		<!-- More files... -->
	</ul>
</div>
