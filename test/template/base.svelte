<script>
  export let layout;
  export let NotFound;
  export let viewProps;
  export let loading;
  export let error;
  export let layout_props = {};
  export let view;
</script>

{#if viewProps}
  {#if viewProps.NotFound}
    <svelte:component this={viewProps.NotFound} />
  {:else}
    {#await layout_props}
      <svelte:component this={loading} />
    {:then layout_props}
      {#await viewProps}
        <svelte:component this={loading} />
      {:then props}
        {#if viewProps.NotFound}
          <svelte:component this={viewProps.NotFound} />
        {:else if layout}
          {#if props}
            <svelte:component this={layout} {...layout_props} {...props}>
              <svelte:component this={view}  {...layout_props} {...props} />
            </svelte:component>
          {:else}
            <svelte:component this={layout}>
              <svelte:component this={view} />
            </svelte:component>
          {/if}
        {:else if props}
          <svelte:component this={view} {...props} />
        {:else}
          <svelte:component this={view} />
        {/if}
      {:catch error$}
        <svelte:component this={error} error={error$} />
      {/await}
    {/await}
  {/if}
{/if}
