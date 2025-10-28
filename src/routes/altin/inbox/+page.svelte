
<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import Loader2Icon from "@lucide/svelte/icons/loader-2";

    let submitting = $state(false);

    let mailText = $state("");

    function submitMail(mail: string, name: string) {
        submitting = true;
        console.log("submitting mail:", mail, "from", name);
    };

    let name = $state("");


</script>



<div class="min-h-screen flex flex-col items-center py-12">
    <h1 class="font-bold text-6xl mb-8">Mail</h1>
      <div class="w-full max-w-3xl h-[60vh] flex flex-col items-center justify-center gap-6 rounded-2xl p-6">
        <div class="w-full h-[40%] p-4 rounded-xl ">
        <Textarea class="w-full h-full resize-none overflow-y-auto rounded-lg border p-3" bind:value={mailText} placeholder="Enter mail..." />
      </div>
  
      <div class="w-full flex items-center justify-center gap-4">
        <AlertDialog.Root>
            <AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}>Submit</AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Submit Mail?</AlertDialog.Title>
                <AlertDialog.Description>
                  Your query will be sent to Mr. Thranians inbox, you may provide a name to assoicate with your letter, however this is optional
                <div class=" items-center justify-center flex pt-4">
                <Input type="value" placeholder="Name (optional)" bind:value={name} class="max-w-xs m-2" />
            </div>
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel onclick={() => submitting = false}>Cancel</AlertDialog.Cancel>
                <AlertDialog.Action onclick={() => submitMail(mailText, name)} disabled={submitting} > {#if submitting} 
                  <Loader2Icon class="animate-spin" />
                  {/if}
                  Send</AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
      </div>
  
    </div>
  </div>

  