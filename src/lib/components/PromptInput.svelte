<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	export let prompt: string = '';
</script>

<div class="flex w-screen flex-col border-t-2 p-4">
	<form on:submit|preventDefault class="space-y-4">
		<Textarea
			placeholder="prompt or /help"
			class="flex-1 p-4 md:min-h-[120px] lg:min-h-[180px]"
			bind:value={prompt}
		/>
		<Button type="submit">Submit</Button>
	</form>
</div>
