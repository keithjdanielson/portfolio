<script>
	import projects from '$lib/data/projects';
</script>

<div class="mt-20 overflow-y-visible pt-6 sm:px-8">
	<ul role="list" class="grid grid-cols-1 gap-x-4 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-2 xl:gap-x-8">
		{#each projects as project}
			<li class="bg-two relative p-8 sm:rounded-lg">
				<h2 class="font-headers text-background flex justify-between pb-2 text-3xl sm:text-4xl">
					<span>{project.name}</span>
					<span class="font-light">{project.date}</span>
				</h2>
				<div
					class="focus-within:ring-background group overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
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
							class="aspect-[8/5] object-cover group-hover:opacity-90"
						/>
					</a>
				</div>
				<p class="font-secondary text-background pointer-events-none mt-2 block text-xl">
					{project.description}
				</p>
				<div class="pt-2">
					{#each project.skills as skill}
						<div
							class="hover:bg-one bg-three mr-1 mt-1 inline-flex cursor-default items-center rounded-full px-2 py-1 text-sm text-white"
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
