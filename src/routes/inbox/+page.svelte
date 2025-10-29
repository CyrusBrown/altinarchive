<script lang="ts">
    import { supabase } from "$lib/supabaseclient";
    import { toast } from "svelte-sonner";
    import Loader2Icon from "@lucide/svelte/icons/loader-2";


    interface Letter {
        id: number;
        created_at: number;
        content: string;
        sender: string;
        config: Record<string, unknown>
    }

    let authenticated = $state(false);
    let c_password = $state("");
    let letters: Array<Letter> = $state([{ id: 0, created_at: Date.now(), content: "somethings wrong", sender: "lord doozer", config: {}}]);
    let submitting = $state(false);

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
     toast.success('Authenticated');
      console.log("authenticated:", data);
      authenticated = true;
    letters = data;
    submitting = false
    }

        
    }

    import { Input } from "$lib/components/ui/input/index.js";
    import Button from "$lib/components/ui/button/button.svelte";

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

<div class="min-h-screen flex items-center justify-center">
    <div class="w-full">

{#each letters as letter}
    <p>{letter.content}</p>
    <p>{letter.sender}</p>
{/each}

</div>
</div> 

{/if}