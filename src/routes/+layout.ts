import { createBrowserClient, createServerClient, isBrowser, parse } from '@supabase/ssr';

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

import type { LayoutLoad } from './$types';
import type { Database } from '../../types/supabase';

export const load: LayoutLoad = async ({ data, fetch }) => {
	const supabase = isBrowser()
		? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					get(key) {
						const cookie = parse(document.cookie);
						return cookie[key];
					}
				}
			})
		: createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					get() {
						return JSON.stringify(data.session);
					}
				}
			});

	const {
		data: { user }
	} = await supabase.auth.getUser();

	return { session: data.session, supabase, user };
};
