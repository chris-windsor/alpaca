<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Nav from '$lib/components/Nav.svelte';
	import PromptInput from '$lib/components/PromptInput.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import ProcessingAlert from '$lib/components/ProcessingAlert.svelte';

	let prompt: string = '';
	let lastPrompt: string = '';
	let messageHistory: string[] = [];
	let currentResponseChunks: string[] = [];
	let errorDescription: string = '';
	let processingDescription: string = '';

	function pushLastChunkedMessage() {
		if (currentResponseChunks.length) {
			messageHistory.push(currentResponseChunks.join(''));
		}
		messageHistory.push(prompt);
		messageHistory = messageHistory;

		currentResponseChunks = [];
	}

	async function submitInput() {
		pushLastChunkedMessage();

		if (prompt.startsWith('/')) {
			await sendCommand();
		} else {
			await sendPrompt();
		}
	}

	async function sendCommand() {
		lastPrompt = prompt;
		prompt = '';
		const processingBannerTimer = setTimeout(() => {
			processingDescription = 'Executing command...';
		}, 750);
		const resp = await fetch('/api/command', {
			method: 'POST',
			body: lastPrompt
		});
		processingDescription = '';
		clearTimeout(processingBannerTimer);

		if (resp.ok) {
			const commandResponse = await resp.text();
			messageHistory.push(commandResponse);
		} else {
			const commandResponse = await resp.json();
			messageHistory.push(commandResponse.message);
		}
		messageHistory = messageHistory;
	}

	async function sendPrompt() {
		lastPrompt = prompt;
		prompt = '';
		const response = await fetch('/api/message', {
			method: 'POST',
			body: lastPrompt
		});

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
		{#if processingDescription.length}
			<ProcessingAlert {processingDescription} />
		{/if}
		<div class="w-screen flex-1 overflow-y-scroll px-4">
			{#each messageHistory as message}
				<p class="mb-2 whitespace-pre-line border-b-2">{message}</p>
			{/each}
			<p class="whitespace-pre-line">
				{#each currentResponseChunks as chunk}
					{chunk}
				{/each}
			</p>
		</div>
		<PromptInput bind:prompt {lastPrompt} on:submit={submitInput} />
	</section>
</main>
