<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	export let prompt: string = '';
	export let lastPrompt: string = '';

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			(event.target as HTMLInputElement).closest('form')?.requestSubmit();
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			prompt = lastPrompt;
		}
	}
</script>

<div class="flex w-screen flex-col border-t-2 p-4">
	<form on:submit|preventDefault class="space-y-4">
		<Textarea
			placeholder="prompt or /help"
			class="flex-1 p-4 md:min-h-[120px] lg:min-h-[180px]"
			bind:value={prompt}
			on:keydown={handleKeyDown}
		/>
		<Button type="submit">Submit</Button>
	</form>
</div>
