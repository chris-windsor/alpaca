<script lang="ts">
	import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';
	import * as Alert from '$lib/components/ui/alert';

	export let errorDescription: string = '';
</script>

<Alert.Root variant="destructive">
	<ExclamationTriangle class="h-4 w-4" />
	<Alert.Title>Error</Alert.Title>
	<Alert.Description>{errorDescription}</Alert.Description>
</Alert.Root>
