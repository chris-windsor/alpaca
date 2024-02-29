import { PUBLIC_OLLAMA_HOST } from '$env/static/public';
import { Ollama, type Message } from 'ollama';

const ollama = new Ollama({ host: PUBLIC_OLLAMA_HOST });

type PromptRequest = { model: string; message: Message };

export async function sendMessage(promptRequest: PromptRequest) {
	return await ollama.chat({
		model: promptRequest.model,
		messages: [promptRequest.message],
		stream: true
	});
}

export async function listModels() {
	return await ollama.list();
}

export async function loadModel(model: string) {
	return await ollama.pull({
		model: model
	});
}
