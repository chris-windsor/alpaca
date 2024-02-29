<script lang="ts">
	import Gear from 'svelte-radix/Gear.svelte';
	import * as Alert from '$lib/components/ui/alert';

	export let processingDescription: string = '';
</script>

<Alert.Root variant="processing">
	<Gear class="h-4 w-4" />
	<Alert.Title>Processing</Alert.Title>
	<Alert.Description>{processingDescription}</Alert.Description>
</Alert.Root>
