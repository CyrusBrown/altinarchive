<script lang="ts">
    import { page } from '$app/state';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseclient';
    import type { PostData } from '$lib/types.ts';
    import { Textarea } from '$lib/components/ui/textarea/index.js';
    import Button from '$lib/components/ui/button/button.svelte';
    import PostPreview from '../../post_preview.svelte';
    import { toast } from 'svelte-sonner';
    import Loader2Icon from '@lucide/svelte/icons/loader-2';
    import { House } from '@lucide/svelte';

    // Posts are only editable for the first 5 minutes after posting.
    // This is also enforced server-side by the row's RLS policy, so a
    // stale client can't sneak an edit through — an out-of-window update
    // simply returns zero affected rows.
    const EDIT_WINDOW_MS = 5 * 60 * 1000;

    const postid = Number(page.params.post_id);

    let loading = $state(true);
    let notFound = $state(false);
    let saving = $state(false);
    let expired = $state(false);

    let current_text = $state('');
    let postDate = $state(0); // ms timestamp of the original post

    let now = $state(Date.now());
    let ticker: ReturnType<typeof setInterval> | undefined;

    onMount(async () => {
        const { data, error } = await supabase
            .from('altinarchive')
            .select('*')
            .eq('id', postid)
            .single();

        if (error || !data) {
            notFound = true;
            loading = false;
            return;
        }

        const post = data as PostData;
        current_text = post.content;
        postDate = new Date(post.date).getTime();
        loading = false;

        ticker = setInterval(() => (now = Date.now()), 1000);
    });

    onDestroy(() => {
        if (ticker) clearInterval(ticker);
    });

    const deadline = $derived(postDate + EDIT_WINDOW_MS);
    const remainingMs = $derived(Math.max(0, deadline - now));
    const editable = $derived(!expired && remainingMs > 0);

    const remainingLabel = $derived.by(() => {
        const total = Math.ceil(remainingMs / 1000);
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    });

    const preview_data: PostData = $derived({
        id: postid,
        date: postDate || Date.now(),
        content: current_text,
        config: {}
    });

    function openPost() {
        const params = new URLSearchParams({ id: String(postid) });
        goto(`/post?${params.toString()}`);
    }

    async function save() {
        if (!editable) return;
        saving = true;

        const { data, error } = await supabase
            .from('altinarchive')
            .update({ content: current_text })
            .eq('id', postid)
            .select();

        saving = false;

        if (error) {
            toast.error('Error: ' + error.message);
            return;
        }

        // RLS returns zero rows once the edit window has closed.
        if (!data || data.length === 0) {
            expired = true;
            toast.error('The edit window has closed — this post can no longer be edited.');
            return;
        }

        toast.success('Post updated');
        openPost();
    }
</script>

<div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-5xl py-8 px-4">
        {#if loading}
            <div class="flex justify-center items-center">
                <h2 class="text-xl font-semibold">Loading...</h2>
            </div>
        {:else if notFound}
            <div class="flex flex-col justify-center items-center">
                <h2 class="text-xl font-semibold">Post not found</h2>
                <Button variant="ghost" class="p-2" onclick={() => goto('/')}>
                    <House class="size-5" />
                </Button>
            </div>
        {:else if !editable}
            <div class="flex flex-col justify-center items-center gap-3">
                <h2 class="text-xl font-semibold">Editing window has closed</h2>
                <p class="text-muted-foreground text-center">
                    Posts can only be edited within 5 minutes of posting.
                </p>
                <div class="flex gap-2">
                    <Button variant="outline" onclick={openPost}>View post</Button>
                    <Button variant="ghost" class="p-2" onclick={() => goto('/')}>
                        <House class="size-5" />
                    </Button>
                </div>
            </div>
        {:else}
            <div class="flex justify-between items-center pb-4">
                <Button variant="ghost" class="p-2" onclick={() => goto('/')}>
                    <House class="size-5" />
                </Button>
                <p class="text-muted-foreground font-semibold">
                    {remainingLabel} left to edit
                </p>
            </div>
            <div class="flex gap-6 flex-grow">
                <div class="flex flex-col gap-2 flex-1">
                    <Textarea bind:value={current_text} />
                    <Button variant="outline" onclick={save} disabled={saving}>
                        {#if saving}
                            <Loader2Icon class="animate-spin" />
                        {/if}
                        Save changes
                    </Button>
                </div>
                <PostPreview postdata={preview_data} className="flex-1" clip={false} />
            </div>
        {/if}
    </div>
</div>
