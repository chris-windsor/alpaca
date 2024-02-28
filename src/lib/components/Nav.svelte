<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<nav class="bg-gray-200 dark:bg-zinc-900">
	<div class="mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<Logo />
				</div>
			</div>
			<div class="ml-6 block">
				<div class="flex items-center">
					<ThemeToggle />
				</div>
			</div>
		</div>
	</div>
</nav>
