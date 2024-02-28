<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Nav from '$lib/components/Nav.svelte';
	import PromptInput from '$lib/components/PromptInput.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';

	let prompt: string = '';
	let messageHistory: string[] = [];
	let currentResponseChunks: string[] = [];
	let errorDescription: string = '';

	async function send() {
		if (currentResponseChunks.length) {
			messageHistory.push(currentResponseChunks.join(''));
		}
		messageHistory.push(prompt);
		messageHistory = messageHistory;

		currentResponseChunks = [];
		const response = await fetch('/api/message', {
			method: 'POST',
			body: prompt
		});
		prompt = '';

		if (!response.body || !response.ok) {
			return (errorDescription = 'Something went wrong. Please try again later.'), false;
		}

		const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
		while (!!reader && true) {
			const { value, done } = await reader?.read();
			currentResponseChunks.push(value || '');
			currentResponseChunks = currentResponseChunks;
			if (done) break;
		}
	}
</script>

<ModeWatcher />
<main>
	<Nav />
	<section class="flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center p-4">
		{#if errorDescription.length}
			<ErrorAlert {errorDescription} />
		{/if}
		<div class="w-screen flex-1 overflow-y-scroll px-4">
			{#each messageHistory as message}
				<p class="mb-2 border-b-2">{message}</p>
			{/each}
			<p>
				{#each currentResponseChunks as chunk}
					{chunk}
				{/each}
			</p>
		</div>
		<PromptInput bind:prompt on:submit={send} />
	</section>
</main>
