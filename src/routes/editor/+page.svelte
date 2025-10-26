<script lang="ts">
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import PostPreview from "../post_preview.svelte";
    import type { PostData } from "$lib/types.ts";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import { supabase } from "$lib/supabaseclient";
    import { toast } from "svelte-sonner";
    import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";


    let current_text: string = $state("type here")

    function getCurrentFormattedDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, add 1
      const day = today.getDate().toString().padStart(2, '0');

      const formattedDate = `${year}/${month}/${day}`;
      return formattedDate;
    }
    
  import { goto } from '$app/navigation';


  let post_result: PostData = $state({"id": 0, date: Date.now(), content:"0", config: {}});


    async function submitPost(content: string, password: string) {
        console.log("submitting post");
        // create_post(password, content);
        const { data, error } = await supabase.functions.invoke('altin-archive', {
          body: { secret: password, content: content }
        })
        if (error) {
          if (error instanceof FunctionsHttpError) {
              const errorMessage = await error.context.json()
              console.log(errorMessage)
              toast.error('Error: ' + errorMessage.error)
            } else if (error instanceof FunctionsRelayError) {
              toast.error('Error: ' + error.message)
            } else if (error instanceof FunctionsFetchError) {
              toast.error('Error: ' + error.message)
            }
          console.log(error)
        } else {
          console.log('Function response data:', data);
          post_result = data.inserted[0] as PostData;
          const params = new URLSearchParams({ id: String(post_result.id) });
          goto(`/post?${params.toString()}`);
        }
        
    }

    let preview_text = $derived(current_text);

    let preview_data: PostData = $derived({id: 0, date: Date.now(), content: preview_text, config: {}});

    import { Input } from "$lib/components/ui/input/index.js";
    
    let secret = $state("");

    import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>



<div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-5xl">
        <div class="flex gap-6 flex-grow">
            <div class="flex flex-col gap-2 flex-1">
              <!-- {#if current_text.length > 10}
            <Toggle bind:pressed={angry_mode} aria-label="toggle">furry mode</Toggle>
             {/if} -->
            <Textarea bind:value={current_text} />
            <AlertDialog.Root>
                <AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}>Post</AlertDialog.Trigger>
                <AlertDialog.Content>
                  <AlertDialog.Header>
                    <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                    <AlertDialog.Description>
                      This action cannot be undone. This will permanently fill your garage with yogurt
                      and remove your yogurt from our servers.
                    <Input type="value" placeholder="password" bind:value={secret} class="max-w-xs m-2" />
                    </AlertDialog.Description>
                  </AlertDialog.Header>
                  <AlertDialog.Footer>
                    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                    <AlertDialog.Action onclick={() => submitPost(preview_text, secret)}>Post</AlertDialog.Action>
                  </AlertDialog.Footer>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </div>
            <PostPreview postdata={preview_data} className="flex-1"/>
        </div>
    </div>
</div>
