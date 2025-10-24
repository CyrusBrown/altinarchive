
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script lang="ts">
    import PostPreview from "./post_preview.svelte";
    import PostFull from "./post_full.svelte";
    import type { PostData } from "$lib/types.ts";
    // import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Dialog, Label, Separator } from "bits-ui";
    import { goto } from "$app/navigation";
    import { supabase } from "$lib/supabaseclient";

    let bruh = $state();

    async function get_posts(){
        const { data } = await supabase.from("altinarchive").select();
        return {
        pdatas: data ?? [],
        } as { pdatas: PostData[] };
    };
    
    let pPromise = $derived(get_posts());
    let posts = $derived(await pPromise);
    
    function openPost(data: PostData){
        goto(`/post/${data.id}`)
    }

    console.log(posts.pdatas);

</script>
<!-- 

<Dialog.Root bind:open={fullviewopen}>
    <Dialog.Trigger />
    <Dialog.Portal>
      <Dialog.Overlay class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"      />
      <Dialog.Content class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[2%] top-[2%] z-50 min-w-full min-h-full overflow-y-scroll"   >
        <div class=" overflow-y-scroll flex items-center justify-center">
        <PostPreview postdata={currentfullpost} className="max-w-4xl" />
        </div>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  -->
<!-- <Dialog.Root bind:open={fullviewopen}>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Content>
        <PostPreview postdata={currentfullpost} />
    </Dialog.Content>
  </Dialog.Root> -->

<!-- <PostFull postdata={currentfullpost} bind:open={fullviewopen} /> -->

<div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-4xl">
    <div class="flex flex-col gap-4 p-16">
        <!-- <a href="/editor" class="text-blue-500 underline ">click me</a> -->
        <div class="flex justify-center">       
             <p class="font-semibold text-muted-foreground">{posts.pdatas.length} posts in the archive</p>
        </div>
        {#each posts.pdatas as post}
        <PostPreview postdata={post} clickedAction={() => openPost(post)} />
        {/each}
    </div>
</div>
</div>

