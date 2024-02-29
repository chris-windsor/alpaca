import { sendMessage } from '$lib/ollama';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const abortController = new AbortController();

	const stream = new ReadableStream({
		async start(controller) {
			const model = cookies.get('selectedModel') || 'llama2';
			const prompt = await request.text();

			console.info(`Using model ${model} to process prompt: ${prompt}`);

			const response = await sendMessage({
				model: model,
				message: {
					role: 'user',
					content: prompt
				}
			});

			for await (const part of response) {
				controller.enqueue(part.message.content);
			}
		},
		cancel() {
			abortController.abort();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
};
