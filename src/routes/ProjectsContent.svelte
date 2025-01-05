<script>
	import projects from '$lib/data/projects';
</script>

<div class="mt-20 px-8 pt-6">
	<ul role="list" class="grid grid-cols-1 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-2 xl:gap-x-8">
		{#each projects as project}
			<li class="bg-background relative rounded-lg p-8">
				<h2 class="font-secondary flex justify-between text-4xl text-black">
					<span>{project.name}</span>
					<span class="font-light">{project.date}</span>
				</h2>
				<div
					class="group overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
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
				<p class="font-secondary pointer-events-none mt-2 block text-xl text-black">
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
