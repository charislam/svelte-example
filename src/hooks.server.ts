import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

import type { Database } from '../types/supabase';

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get: (key) => event.cookies.get(key),
				/**
				 * SvelteKit's cookies API requires `path` to be explicitly set in
				 * the cookie options. Setting `path` to `/` replicates previous/
				 * standard behavior.
				 */
				set: (key, value, options) => {
					event.cookies.set(key, value, { ...options, path: '/' });
				},
				remove: (key, options) => {
					event.cookies.delete(key, { ...options, path: '/' });
				}
			}
		}
	);

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function first calls `getUser()` to validate and
	 * update the JWT, before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		await event.locals.supabase.auth.getUser();
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` header, so we need to
			 * tell SvelteKit to pass it through.
			 */
			return name === 'content-range';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	event.locals.session = await event.locals.safeGetSession();

	if (!event.locals.session && event.url.pathname.startsWith('/private')) {
		redirect(303, '/auth');
	}

	if (event.locals.session && event.url.pathname === '/auth') {
		redirect(303, '/private');
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
