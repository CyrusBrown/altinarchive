
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script lang="ts">
    import PostPreview from "./post_preview.svelte";
    import type { PostData } from "$lib/types.ts";
    import { goto } from "$app/navigation";
    import { supabase } from "$lib/supabaseclient";


    async function get_posts(){
        const { data } = await supabase.from("altinarchive").select();
        return {
        pdatas: data ?? [],
        } as { pdatas: PostData[] };
    };
    
    let pPromise = $derived(get_posts());
    let posts = $derived(await pPromise);
    
    function openPost(data: PostData){
      const params = new URLSearchParams({ id: String(data.id) });
      goto(`/post?${params.toString()}`, {noScroll: true});
    }

    console.log(posts.pdatas);

</script>

<div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-4xl">
    <div class="flex flex-col gap-4 py-16 px-4">
        <!-- <a href="/editor" class="text-blue-500 underline ">click me</a> -->
        <div class="flex justify-center">       
             <p class="font-semibold text-muted-foreground">{posts.pdatas.length} posts in the archive</p>
        </div>
        
        {#each [...posts.pdatas].reverse() as post}
        <PostPreview postdata={post} clickedAction={() => openPost(post)} data-sveltekit-noscroll/>
        {/each}
    </div>
</div>
</div>

