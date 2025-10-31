<script lang="ts">
    import { Dialog, Label, Separator } from "bits-ui";

    let { children, modal_open = $bindable() } = $props();
</script>



<Dialog.Root bind:open={modal_open} >
    <Dialog.Portal>
      <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border-0 outline-0">
            {@render children?.()}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>