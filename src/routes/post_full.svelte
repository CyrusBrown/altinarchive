
<script lang="ts">
    import { marked } from "marked";
    import type { PostData } from "$lib/types.ts";

    let { postdata, className = '', open = $bindable()}: { postdata: PostData, className?: string, open: boolean} = $props()

    marked.use({
        gfm: true
        });
      
</script>

<!-- Trigger button -->
<!-- <button
	onclick={openModal}
	class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
>
	Open Modal
</button> -->

<!-- Modal + Backdrop -->
{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 flex items-center justify-center bg-black/30 animate-[fade_0.2s_ease-out_both]"
		onclick={() => (open = false)}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="max-w-lg w-full bg-white rounded-md p-6 shadow-lg animate-[zoom_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]"
		>
			<h2 class="text-lg font-semibold mb-2">Example Modal</h2>
			<p>This modal closes when you click outside it.</p>
		</div>
	</div>
{/if}

<style>
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>



<!-- <dialog>
<div class={`w-full ${className}`}>
    <div class="border-accent border-4 p-6 pt-4 rounded-xl w-full max-h-96">
    <div class="flex justify-center pb-2">    
        <h3 class="text-muted-foreground font-semibold">{postdata.date}</h3>
    </div>
    <article class="prose dark:prose-invert typography">
        {@html marked.parse(postdata.content)}
    </article>
    </div>
</div>  
</dialog> -->