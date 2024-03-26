<script>
	export let data;
	$: ({ supabase } = data);

	$: logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	};
</script>

<header>
	<nav>
		<a href="/">Home</a>
		<a href="/private">Private</a>
		<a href="/private/nested">Nested</a>
	</nav>
	<button on:click={logout}>Logout</button>
</header>
<main>
	<slot />
</main>
