<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { bS, iS, tS } from '$lib/client/styles';
	import HeaderBar from '$lib/client/components/HeaderBar.svelte';

	let { data } = $props();
	let settings = $state({});
	let status = $state({
		message: '',
		color: 'green'
	});

	const pageTitle = 'Settings | TAM';

	onMount(() => {
		settings = { ...data.settings };
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<HeaderBar>
	<div>Settings Sections:</div>
	{#if data.settings.remote_server}
		<a href={resolve('/settings/auth-keys')} class={bS.gray}>Auth Keys</a>
	{/if}
	<a href={resolve('/settings/prefixes')} class={bS.gray}>Prefixes</a>
</HeaderBar>

<div id="app_container" class="p-1">
	<h1 class="text-xl font-bold">{pageTitle}</h1>
	<div class="flex flex-col gap-1 w-full py-1">
		<h2 class="text-lg font-bold">Remote Mode:</h2>
		<div class="flex flex-row gap-1 items-center">
			<div>Remote Server:</div>
			<input type="text" class={iS.normal} bind:value={settings.remote_server} />
		</div>
		<div class="flex flex-row gap-1 items-center">
			<div>Remote Port:</div>
			<input type="text" class={iS.normal} bind:value={settings.remote_port} />
		</div>
		<div class="flex flex-row gap-1 items-center">
			<div>Remote TLS:</div>
			<button
				class={bS.gray}
				onclick={() => {
					settings.remote_tls = !settings.remote_tls;
				}}>{settings.remote_tls ? 'Yes' : 'No'}</button
			>
		</div>
		<h2 class="text-lg font-bold">Default Preferences:</h2>
		<div class="flex flex-row gap-1 items-center">
			<div>Contact Preference:</div>
			<button
				class={bS.gray}
				onclick={() => {
					settings.default_pref === 'CALL'
						? (settings.default_pref = 'TEXT')
						: (settings.default_pref = 'CALL');
				}}>{settings.default_pref}</button
			>
		</div>
		<div class="flex flex-row gap-1 items-center">
			<div>Venue Name:</div>
			<input type="text" class={iS.normal} bind:value={settings.venue_name} />
		</div>
		<div class="flex flex-row gap-1 items-center">
			<button
				class={bS.gray}
				onclick={async () => {
					const res = await fetch('/api/settings', {
						method: 'POST',
						body: JSON.stringify(settings),
						headers: { 'Content-Type': 'application/json' }
					});
					if (!res.ok) {
						status.message = `Error Code: ${res.status}`;
						status.color = 'red';
					} else {
						const resData = await res.json();
						settings = { ...resData };
						status.message = 'Settings saved successfully!';
						status.color = 'green';
					}
				}}>Save</button
			>
			<button class={bS.gray}>Cancel</button>
		</div>
		<div>
			<p class={tS[status.color]}>{status.message}</p>
		</div>
	</div>
</div>
