<script>
	import jobs from '$lib/data/jobs';
	import skills from '$lib/data/skills';
</script>

<div class="flex lg:pl-12">
	<div class="xl:max-w-8xl mx-auto grid gap-8">
		<div class="flex">
			<div class="sm:flex sm:w-32 sm:items-center sm:justify-center">
				<span
					class="hidden -rotate-90 transform whitespace-nowrap font-headers text-7xl font-bold text-background transition-colors duration-200 hover:text-white sm:block xl:text-9xl"
					>Jobs</span
				>
			</div>
			<div class="flex flex-col lg:pl-8">
				{#each jobs as job}
					<div
						class="xl:max-w-8xl group relative flex flex-col items-start overflow-hidden rounded-md text-background transition-colors duration-200 hover:bg-one hover:bg-opacity-50 hover:text-white md:flex-row md:space-x-8"
					>
						<div class="px-4 pb-0 sm:pr-5 sm:pt-5">
							<span class="font-secondary">{job.from} - {job.to}</span>
						</div>
						<div class="flex-1">
							<div class="px-4 pb-0 sm:px-5 sm:pt-5">
								<span class="font-secondary text-xl font-semibold lg:text-2xl">
									{job.position.toUpperCase()} - {job.company}
								</span>
							</div>
							<div class="px-4 pb-0 sm:px-5 sm:pt-5">
								<ul class="space-y-2 font-secondary text-lg md:text-xl xl:max-w-5xl">
									{#each job.achievements as achievement}
										<li>{achievement}</li>
									{/each}
								</ul>
							</div>
							<div class="px-4 py-2 xl:max-w-5xl">
								{#each job.skills as skill}
									<div
										class="hover:bg-palette-3 mr-1 mt-1 inline-flex cursor-default items-center rounded-full bg-black bg-opacity-20 px-2 py-1 text-sm text-background hover:bg-opacity-100"
									>
										<span class="font-secondary text-lg">{skill}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="xl:max-w-8xl flex">
			<div class="flex items-center justify-center sm:w-32">
				<span
					class="hidden -rotate-90 transform whitespace-nowrap font-headers text-7xl font-bold text-background transition-colors duration-200 hover:text-white sm:block xl:text-9xl"
					>Skills</span
				>
			</div>
			<div class="pb-12 sm:pl-8 xl:max-w-7xl xl:pb-0">
				<div class="grid grid-cols-1 xl:grid-cols-2 xl:gap-6">
					{#each Object.entries(skills) as [category, skillList]}
						<div class="bg-background p-4 xl:rounded-lg">
							<span class="mb-3 block font-secondary text-2xl text-black">
								{category}
							</span>
							<div class="flex flex-wrap gap-2 xl:max-w-3xl">
								{#each skillList as skill}
									<div
										class="cursor-default rounded-full bg-two px-3 py-1 text-lg text-background transition-colors duration-200 hover:bg-one hover:text-white"
									>
										<span class="font-secondary">{skill}</span>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
