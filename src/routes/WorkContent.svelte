<script>
	import jobs from '$lib/data/jobs';
	import skills from '$lib/data/skills';
</script>

<div class="flex py-12 lg:pl-12">
	<div class="xl:max-w-8xl mx-auto grid gap-8">
		<div class="flex">
			<div class="sm:flex sm:w-32 sm:items-center sm:justify-center">
				<span
					class="font-headers text-background hidden -rotate-90 transform whitespace-nowrap text-8xl font-bold transition-colors duration-200 hover:text-white sm:block xl:text-9xl"
					>Jobs</span
				>
			</div>
			<div class="flex flex-col lg:pl-8">
				{#each jobs as job}
					<div
						class="hover:bg-one xl:max-w-8xl text-background group relative flex flex-col items-start overflow-hidden rounded-md transition-colors duration-200 hover:bg-opacity-50 hover:text-white md:flex-row md:space-x-8"
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
								<ul class="font-secondary space-y-2 text-lg md:text-xl xl:max-w-5xl">
									{#each job.achievements as achievement}
										<li>{achievement}</li>
									{/each}
								</ul>
							</div>
							<div class="px-4 py-2 xl:max-w-5xl">
								{#each job.skills as skill}
									<div
										class="hover:bg-palette-3 text-background mr-1 mt-1 inline-flex cursor-default items-center rounded-full bg-black bg-opacity-20 px-2 py-1 text-sm hover:bg-opacity-100"
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
			<div class="flex w-32 items-center justify-center">
				<span
					class="font-headers text-background -rotate-90 transform whitespace-nowrap text-8xl font-bold transition-colors duration-200 hover:text-white xl:text-9xl"
					>Skills</span
				>
			</div>
			<div class="pl-8 xl:max-w-7xl">
				<div class="grid grid-cols-2 gap-6">
					{#each Object.entries(skills) as [category, skillList]}
						<div class="bg-background rounded-lg p-4">
							<span class="font-secondary mb-3 block text-2xl text-black">
								{category}
							</span>
							<div class="flex flex-wrap gap-2 xl:max-w-2xl">
								{#each skillList as skill}
									<div
										class="text-background bg-two hover:bg-one cursor-default rounded-full px-3 py-1 text-lg transition-colors duration-200 hover:text-white"
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
