<script>
	export let data;
	$: ({ countries, user } = data);
</script>

<h1>Welcome to Supabase{user ? `, ${user.email}!` : '!'}</h1>
<nav>
	{#if user}
		<a href="/private">Private pages</a>
	{:else}
		<a href="/auth">Login</a>
	{/if}
	<a href="/private/nested">Nested test</a>
</nav>
<ul>
	{#each countries as country}
		<li>{country.name}</li>
	{/each}
</ul>
