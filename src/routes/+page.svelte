<script>
    export let data
    $: ({ user } = data)
</script>

<h1>Welcome to Supabase{user ? `, ${user.email}!` : '!'}</h1>
<nav>
{#if user}
<a href="/private">Private pages</a>
{:else}
<a href="/auth">Login</a>
{/if}
</nav>