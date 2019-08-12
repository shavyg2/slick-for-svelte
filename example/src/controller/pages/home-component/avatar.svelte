


<script>

export let avatarUrl;


</script>

<style>
    .placeholder{
        width:150px;
        height:150px;
    }
</style>


{#await avatarUrl}
    <div class="placeholder flex flex-row justify-center items-center bg-gray-200">
        <div class="no-underline text-black">Placeholder</div>
    </div>
{:then avatarUrl}
    <img src={avatarUrl} width=150 alt="avatar"/>
{/await}
