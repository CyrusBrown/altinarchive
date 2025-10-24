<script lang="ts">

import { page } from '$app/state';
import type { PostData } from "$lib/types.ts";
import Button from '$lib/components/ui/button/button.svelte';
import { ArrowLeft, House, ArrowRight} from '@lucide/svelte';
import { goto } from "$app/navigation";
import { supabase } from "$lib/supabaseclient";


import { marked } from "marked";

// const testpost: PostData = {
//         id: 1,
//         date: "2024-06-08",
//         content: '# Heading 1\n## Heading 2\n### Heading 3\n**Bold Text** *Italic Text* ~~Strikethrough~~\n[Link test](https://en.wikipedia.org/wiki/Riemann_hypothesis)\n![Image Alt Text]()\n`Inline Code`\n```python\nprint("Code Block")\n```\n> Blockquote\n- Unordered List Item 1\n- Unordered List Item 2\n1. Ordered List Item 1\n2. Ordered List Item 2\n| Table Header 1 | Table Header 2 |\n|---------------|---------------|\n| Row 1 Cell 1  | Row 1 Cell 2  |\n---\nHorizontal Rule\n**Nested *Emphasis* Text**\n In number theory, an Euler product is an expansion of a Dirichlet series into an infinite product indexed by prime numbers. \nThe original such product was given for the sum of all positive integers raised to a certain power as proven by Leonhard Euler. \nThis series and its continuation to the entire complex plane would later become known as the Riemann zeta function In number theory, an Euler product is an expansion of a Dirichlet series into an infinite product indexed by prime numbers. \nThe original such product was given for the sum of all positive integers raised to a certain power as proven by Leonhard Euler. \nThis series and its continuation to the entire complex plane would later become known as the Riemann zeta function In number theory, an Euler product is an expansion of a Dirichlet series into an infinite product indexed by prime numbers. \nThe original such product was given for the sum of all positive integers raised to a certain power as proven by Leonhard Euler. \nThis series and its continuation to the entire complex plane would later become known as the Riemann zeta function'
//     };

let postid = $derived(page.params.post_id ? +page.params.post_id : 0);

function next_post(){
    goto(`/post/${postid + 1}`);
}
function prev_post(){
    goto(`/post/${Math.max(0, postid - 1)}`);
}

marked.use({
        gfm: true
        });

let pPromise: Promise<PostData | undefined> = $derived(reload_post(postid));
let postdata: PostData | undefined = $derived(await pPromise);


async function reload_post(id: number){
    const { data, error } = await supabase.from("altinarchive").select("*").eq("id", id).single();
    if (error) {
        console.error("Error fetching post:", error);
        return;
    }
    return data as PostData;
}


</script>

<div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-4xl p-8">

    <!-- <div class="p-2 flex justify-center items-center">
</div> -->
<svelte:boundary>
<div class="w-full">
    {#snippet pending()}
    <div class="flex justify-center items-center">
        <h2 class="text-xl font-semibold">Loading...</h2>
    </div>
	{/snippet}
    {#if postdata}
    <div class="border-accent border-4 p-6 pt-3 rounded-xl w-full max-w-4xl relative">
    <Button variant="ghost" class="p-2 absolute top-3 left-2" onclick={() => goto("/")} ><House class="size-5"/></Button>
    <div class="flex justify-center pb-8">    
        <Button variant="ghost" class="p-1" onclick={() => prev_post()}><ArrowLeft class="size-5"/></Button>
        <h3 class="text-muted-foreground font-semibold p-2">{postdata.date}</h3>
        <Button variant="ghost" class="p-2" onclick={() => next_post()}><ArrowRight class="size-5"/></Button>
    </div>
    <article class="prose dark:prose-invert typography">
        {postid}
            {@html marked.parse(postdata.content)}

    </article>
    </div>
    {:else}
    <div class="flex flex-col justify-center items-center">
        <h2 class="text-xl font-semibold">Post not found</h2>
        <Button variant="ghost" class="p-2" onclick={() => goto("/")} ><House class="size-5"/></Button>

    </div>
    {/if}
</div>  
</svelte:boundary>

    </div>
</div>