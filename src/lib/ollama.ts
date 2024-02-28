import { PUBLIC_OLLAMA_HOST } from '$env/static/public';
import { Ollama, type Message } from 'ollama';

const ollama = new Ollama({ host: PUBLIC_OLLAMA_HOST });

export async function sendMessage(message: Message) {
	return await ollama.chat({
		model: 'llama2',
		messages: [message],
		stream: true
	});
}
