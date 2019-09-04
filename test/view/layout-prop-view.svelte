<script>
    export let user;
</script>

<nav>
    <ul>
        <li>Home</li>
        <li>Contact</li>
        <li id="user-menu">{user.username}</li>
    </ul>
    
</nav>
<slot/>