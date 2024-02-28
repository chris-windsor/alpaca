import { sendMessage } from '$lib/ollama';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const abortController = new AbortController();

	const stream = new ReadableStream({
		async start(controller) {
			const response = await sendMessage({
				role: 'user',
				content: await request.text()
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
