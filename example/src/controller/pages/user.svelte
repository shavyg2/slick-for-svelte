<script>
    export let user;
</script>



<div class="px-2 flex flex-row">
    <img class="mr-3 rounded" width="200" src={user.avatar_url} alt="user avatar"/>
    <div class="flex flex-col">
        <div class="text-2xl">{user.login}</div>
        
        <div>
            <div class="my-3 mb-1">Repos</div>
            <div>
                {user.public_repos}</div>
            </div>
        <div>
        </div>
    </div>
</div>
        
