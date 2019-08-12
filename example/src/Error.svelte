<script>
    export let error;

</script>

<div>
    <h1 class="text-5xl">Error</h1>

    {#if !!error.message && !!error.stack}
    <pre>
        {error.message}
    </pre>
    <pre>
        {error.stack}
    </pre>
    {:else if typeof error==="string"}
        <pre>
            {error}
        </pre>
    {:else}
        <pre style="white-space: pre-wrap;">
            {JSON.stringify(error,null,2)}
        </pre>
    {/if}
</div>