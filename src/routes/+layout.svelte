<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { afterNavigate } from '$app/navigation';
	import { trackPageView } from '$lib/analytics';

	afterNavigate(({ to }) => {
		if (to?.url) trackPageView(to.url);
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster />
<ModeWatcher />
{@render children?.()}
