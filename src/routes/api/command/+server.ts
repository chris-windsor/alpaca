import { listModels, loadModel } from '$lib/ollama';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const rawCommand = await request.text();
	const commandArgs = rawCommand.split(' ').filter((arg) => arg.trim().length);
	const command = commandArgs.splice(0, 1)[0];

	if (command === '/list') {
		const models = await listModels();
		return new Response(JSON.stringify(models));
	} else if (command === '/load') {
		const loadResp = await loadModel(commandArgs[0]);
		return new Response(JSON.stringify(loadResp));
	} else if (command === '/use') {
		cookies.set('selectedModel', commandArgs[0], {
			path: '/'
		});
	}

	return new Response();
};
