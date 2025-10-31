<script lang="ts">

	let { showModal = $bindable(), children, class: className = ""} = $props();

    let dialog: HTMLDialogElement = $state();

    $effect(() => {
        if (showModal) dialog.showModal();
    });

</script>

<dialog bind:this={dialog} 	
    onclose={() => (showModal = false)}
	onclick={(e) => { if (e.target === dialog) dialog.close(); }}
    class={className}
>
    {@render children?.()}
</dialog>
