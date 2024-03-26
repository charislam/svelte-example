<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((evt, newSession) => {
			if (newSession?.access_token !== session?.access_token) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				setTimeout(() => {
					goto('/', { invalidateAll: true });
				});
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<slot />
