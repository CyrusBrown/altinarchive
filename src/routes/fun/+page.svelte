<script>
    import { Tween } from 'svelte/motion';
    import { linear } from 'svelte/easing';
  
    let x = $state(0);
    let y = $state(0);
    let isFollowing = $state(true);
  
    // Tween for size, with dynamic duration based on scaling direction
    const size = Tween.of(
      () => (isFollowing ? 20 : 400), // Size: 20px when following, 400px when not
      {
        duration: () => (isFollowing ? 100 : 10000), // 1s to scale down, 40s to scale up
        easing: linear
      }
    );
  
    function handleMouseMove(event) {
      if (isFollowing) {
        x = event.clientX;
        y = event.clientY;
        size.set(20); // Ensure size is 20 when following
      }
    }
  
    function handleClick() {
      if (!isFollowing && size.current >= 400) {
        // Navigate to /circleland when circle is at maximum size
        window.location.href = '/fun';
      } else {
        isFollowing = !isFollowing;
        // Tween.of handles size changes reactively
      }
    }

    let likes = $state(1)
    let opacity_amount = $derived(Math.min(likes / 100, 1).toFixed(2))

</script>

<style>
  .galaxy-portal {
    background: radial-gradient(
      circle at 50% 50%,
      rgba(126, 34, 0, 0.9) 10%, /* Dark center, like a galactic core */
      transparent 15%,
      rgba(190, 14, 14, 0.2) 20%, /* Starry spiral arm */
      transparent 25%,
      rgba(255, 162, 100, 0.3) 30%, /* Bluish spiral arm */
      transparent 35%,
      rgba(193, 3, 3, 0.15) 40%, /* Another spiral arm with stars */
      transparent 45%,
      rgba(125, 38, 12, 0.8) 50% /* Outer dark space */
    ),
    /* Starry background with small white dots */
    radial-gradient(
      circle,
      rgba(131, 0, 0, 0.8) 1px,
      transparent 2px
    ) 0 0 / 20px 20px; /* Star pattern */
    box-shadow: 
      0 0 20px rgba(146, 1, 1, 0.5), /* Outer glow */
      inset 0 0 30px rgba(255, 144, 100, 0.7); /* Inner blue glow */
    animation: spin 10s linear infinite; /* Slower rotation for galaxy effect */
  }

  @keyframes spin {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

</style>


<div class="fixed top-0 left-0 w-full h-full z-[-10]">
  <iframe 
    width="100%" 
    height="100%" 
    src="https://www.youtube.com/embed/mS5WYp5xmvI?si=9XifuSbWDfLSn6le&autoplay=1&controls=0" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen
    class="pointer-events-none"
    style="opacity: {opacity_amount}"
  ></iframe>
</div>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore element_invalid_self_closing_tag -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:window onmousemove={handleMouseMove} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="fixed bg-red-500 rounded-full cursor-pointer {size.current >= 400 ? 'galaxy-portal drop-shadow-orange-500 drop-shadow-2xl' : ''}"
  style="left: {x}px; top: {y}px; width: {size.current}px; height: {size.current}px; transform: translate(-50%, -50%);"
  onclick={handleClick}
/>

<div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-4xl place-items-center">
        <div class="hover:bg-pink-500 p-8 hover:scale-125 bg-pink-950 transition-all hover:animate-spin p-20"></div>
        <div class="p-10"> </div>
        <div class="hover:bg-green-500 p-8 hover:scale-200 hover:scale- hover:rotate-45 bg-green-950 transition-all drop- shadow-inner hover:animate-pulse rounded-full hover:opacity-30 p-20"></div>
        <div class="p-10"> </div>
        <div class="p-8 items-center justify-center flex flex-col gap-5">
          <div class="p-40 w-1/5 bg-amber-400 rounded-xl transition-all relative">
            <img 
              src="https://cdn.discordapp.com/attachments/751605360778805249/1427525855889850398/image.png?ex=68ef2e8e&is=68eddd0e&hm=68d0a956b92d0998457fa9dc9f5e8f1b23727eb1efe68dc30deb1ad75d5acaf0&"
              class="absolute top-0 left-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-all animate-pulse duration-1000"
            >
            <img 
              src="https://cdn.discordapp.com/attachments/751605360778805249/1427520916912476231/OIP-3966165628.lRMNFzReWsESPi0pusgYtgHaHa.jpg?ex=68ef29f4&is=68edd874&hm=8813526c6a344adb123b4624d3e5439f0e0d0e45063113996cb415f32804465b&"
              class="absolute top-0 left-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-all"
            >
          </div>
          <button 
          onclick={() => {likes += 1}}
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Like! {likes} likes
        </button>   
        </div>

    </div>
</div>


<div class="absolute top-20 right-20 p-20 rounded-xl bg-sky-500 hover:scale-50 hover:animate-pulse transition-all hover:bg-gradient-to-tl"></div>

<div class="absolute bottom-10 left-10 hover:animate-spin transition-all hover:scale-125">
  <iframe 
    width="560" 
    height="315" 
    src="https://www.youtube.com/embed/-T1Uwy8ptpo?si=F4lRhmo1pRyf0ro7&autoplay=1&controls=0&mute=0" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen
    class="pointer-events-none"
  ></iframe>
</div>

<div class="absolute bottom-10 right-10 hover:animate-spin transition-all hover:scale-125">
  <iframe 
    width="560" 
    height="315" 
    src="https://www.youtube.com/embed/4LPF2XNRxGk?si=ubarRXoQrCQkLc89&autoplay=1&controls=0&mute=0" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen
    class="pointer-events-none"
  ></iframe>
</div>
<!-- <Skewsquare mouseX={x} mouseY={y} classes="top-40 right-40 bg-sky-600" /> -->
 