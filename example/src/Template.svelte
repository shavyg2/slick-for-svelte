<script>
    export let layout;
    export let NotFound;
    export let viewProps;
    export let loading;
    export let error;
    export let view;
</script>
{#await viewProps}
    {#if layout}
            <svelte:component this={layout}>
                <svelte:component this={loading}/>
            </svelte:component>
        {:else}
            <svelte:component this={loading}/>
    {/if}
{:then props}
    {#if viewProps.NotFound}
        <svelte:component this={props.NotFound}  />
    {:else}
        {#if props.layout||layout}
            <svelte:component this={props.layout || layout} {...props}>
                <svelte:component this={view} {...props}/>
            </svelte:component>
        {:else}
            <svelte:component this={view} {...props}/>
        {/if}
    {/if}
{:catch error$}
    <svelte:component this={error}  error={error$}/>
{/await}