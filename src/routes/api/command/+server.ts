import { listModels, loadModel } from '$lib/ollama';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const rawCommand = await request.text();
	const commandArgs = rawCommand.split(' ').filter((arg) => arg.trim().length);
	const command = commandArgs.splice(0, 1)[0];

	if (command === '/list') {
		const listResp = await listModels();
		return new Response(
			`Loaded models:
			${listResp.models.map((model) => `+ ${model.name}`).join('\n')}
			All available models can be found at: https://ollama.com/library`
		);
	} else if (command === '/load') {
		const loadResp = await loadModel(commandArgs[0]);
		return new Response(`${loadResp.status} loading model ${commandArgs[0]}`);
	} else if (command === '/use') {
		const listResp = await listModels();
		const requestedModel = commandArgs[0];
		const matchingLoadedModel = listResp.models.find((model) => {
			return (
				model.name === (requestedModel.includes(':') ? requestedModel : `${requestedModel}:latest`)
			);
		});

		if (matchingLoadedModel) {
			cookies.set('selectedModel', commandArgs[0], {
				path: '/'
			});
			return new Response(`Selected model ${commandArgs[0]}`);
		} else {
			return new Response(`Model ${commandArgs[0]} is not loaded`);
		}
	} else if (command === '/help') {
		return new Response(
			`Available commands:
			/list
			/load <modelName>
			/use <modelName>`
		);
	}

	return new Response('Unknown command');
};
