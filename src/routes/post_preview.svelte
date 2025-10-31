
<script lang="ts">
    import { marked } from "marked";
    import type { PostData } from "$lib/types.ts";

    let { postdata, className = '', clickedAction = () => {}, clip = true}: { postdata: PostData, className?: string, clickedAction?: () => void, clip: boolean } = $props()

    marked.use({
        gfm: true
        });
      
    function handle_click_action(e: MouseEvent) {
        e.preventDefault()
        clickedAction();
    }

</script>


<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={`w-full ${className}`} onclick={(e) => handle_click_action(e)}>
    <div class="border-accent border-4 p-6 pt-4 rounded-xl w-full max-h-96" class:overflow-clip={clip} class:max-h-96={clip} >
    <div class="flex justify-center pb-2">    
        <h3 class="text-muted-foreground font-semibold">{new Date(postdata.date).toISOString().split('T')[0].replace(/-/g, '/')}</h3>
    </div>
    <article class="prose dark:prose-invert typography pointer-events-none">
        {@html marked.parse(postdata.content)}
    </article>
    
    </div>
</div>  
