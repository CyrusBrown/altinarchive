<script lang="ts">
    import { supabase } from "$lib/supabaseclient";
    import { toast } from "svelte-sonner";
    import Loader2Icon from "@lucide/svelte/icons/loader-2";
    import { browser } from "$app/environment";
    import Dialogsimple from "$lib/components/custom/dialogsimple.svelte";


    interface Letter {
        id: number;
        created_at: number;
        content: string;
        sender: string;
        config: Record<string, unknown>
    }

    let authenticated = $state(false);
    let c_password = $state("");
    const defaultletter = { id: 0, created_at: Date.now(), content: "somethings wrong", sender: "lord doozer", config: {}}
    let letters: Array<Letter> = $state([defaultletter]);
    let submitting = $state(false);

    if (browser) {
      const storedValue = localStorage.getItem('mail_c_password');
      if (storedValue) {
        c_password = JSON.parse(storedValue);
        get_posts(JSON.parse(storedValue));
      }
    }

    async function get_posts(p_password: String){
        submitting = true
        let { data, error } = await supabase
            .rpc('aamail_get_if_secret', {
                p_password
            })
        if (error) {
      console.log("error logging in:", error);
      toast.error('Error logging in');
      submitting = false
    }

    else {
    if (browser) {
      localStorage.setItem('mail_c_password', JSON.stringify(p_password));
    }
     toast.success('Authenticated');
      console.log("authenticated:", data);
      authenticated = true;
    letters = data;
    submitting = false
    }

    
        
    }

    import { Input } from "$lib/components/ui/input/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import { marked } from "marked";
    import Dzdialog from "$lib/components/custom/dzdialog.svelte";
    marked.use({
        gfm: true
        });


    let letterview = $state(false);
    let currentletter: Letter = $state(defaultletter);

    function openLetterview(clicked_letter: Letter){
        currentletter = clicked_letter;
        letterview = true;
    }

</script>




{#if !authenticated}

<div class="min-h-screen flex flex-col gap-4 items-center justify-center">
        <p class="font-semibold text-3xl">Password</p>
        <Input type="password" placeholder="Password" bind:value={c_password} class="max-w-sm" />
        <Button onclick={() => get_posts(c_password)} disabled={submitting}>{#if submitting} 
            <Loader2Icon class="animate-spin" />
            {/if}
            Submit</Button>
</div>  

{:else}
<!-- <div class="fixed inset-0 flex items-center justify-center z-50"> -->
<!-- <Dialogsimple bind:showModal={letterview} class="p-5 bg-muted m-auto">
        <p>test</p>
</Dialogsimple> -->
<Dzdialog bind:modal_open={letterview}>
    <div class="border-accent border-4 rounded-xl p-4 bg-background w-screen sm:w-2xl">
        <p class="text-accent-foreground">From: {currentletter.sender}</p>
        <article class="prose dark:prose-invert typography pointer-events-none max-w-none">
            {@html marked.parse(currentletter.content)}
        </article>
    </div>
</Dzdialog>
<!-- </div> -->

<div class="min-h-screen flex items-center justify-center">
    <div class="flex flex-col items-center justify-center max-w-xl gap-4 p-4 rounded-xl">
        {#each letters as letter}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="max-h-24 border-accent border-4 rounded-xl p-4 overflow-hidden" onclick={() => openLetterview(letter)}>
                <p class="text-accent-foreground">From {letter.sender}</p>
                <article class="prose dark:prose-invert typography pointer-events-none">
                    {@html marked.parse(letter.content)}
                </article>
            </div>
        {/each}
    </div>
</div>
{/if}