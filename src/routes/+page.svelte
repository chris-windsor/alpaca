<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Nav from '$lib/components/Nav.svelte';
	import PromptInput from '$lib/components/PromptInput.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';

	let prompt: string = '';
	let messageHistory: string[] = [];
	let currentResponseChunks: string[] = [];
	let errorDescription: string = '';

	async function submitInput() {
		if (prompt.startsWith('/')) {
			await sendCommand();
		} else {
			await sendPrompt();
		}
	}

	async function sendCommand() {
		if (prompt.startsWith('/help')) {
			messageHistory.push('Available commands:\n/list \n/load <modelName> ');
			messageHistory = messageHistory;
		}

		const resp = await fetch('/api/command', {
			method: 'POST',
			body: prompt
		});
		prompt = '';

		const parsedResponse = await resp.json();
		messageHistory.push(JSON.stringify(parsedResponse, null, 2));
		messageHistory = messageHistory;
	}

	async function sendPrompt() {
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
				<pre class="mb-2 border-b-2">{message}</pre>
			{/each}
			<pre>
				{#each currentResponseChunks as chunk}
					{chunk}
				{/each}
			</pre>
		</div>
		<PromptInput bind:prompt on:submit={submitInput} />
	</section>
</main>
