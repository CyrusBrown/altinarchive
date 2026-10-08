import { dev } from '$app/environment';
import { supabase } from '$lib/supabaseclient';

function getVisitorId(): string | null {
	try {
		let id = localStorage.getItem('visitor_id');
		if (!id) {
			id = crypto.randomUUID();
			localStorage.setItem('visitor_id', id);
		}
		return id;
	} catch {
		return null;
	}
}

export async function trackPageView(url: URL) {
	if (dev) return;

	// Only keep referrers from other sites, not internal navigation.
	const referrer = document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer : null;

	const { error } = await supabase.from('page_views').insert({
		path: url.pathname + url.search,
		referrer,
		visitor_id: getVisitorId()
	});
	if (error) console.warn('analytics:', error.message);
}
