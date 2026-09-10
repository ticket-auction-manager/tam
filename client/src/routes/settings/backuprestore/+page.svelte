<script>
	import { resolve } from '$app/paths';
	import HeaderBar from '$lib/client/components/HeaderBar.svelte';
	import { bS, iS } from '$lib/client/styles';

	const pageTitle = 'Backup and Restore | TAM';

	let { data } = $props();
	let { remoteServer, tamClientID } = $derived(data);
	let uploadFile = $state();
	let contents = $state('');
	let results = $state('');

	function setResult(newResult) {
		results = newResult;
		setTimeout(() => (results = ''), 10000);
	}

	async function downloadBackupFile(target) {
		let fetch_url;
		if (target === 'local') {
			fetch_url = '/api/backuprestore/local';
		} else if (target === 'remote') {
			fetch_url = '/api/backuprestore/remote';
		}
		const now = new Date();
		const date = {
			year: now.getFullYear(),
			month: String(now.getMonth() + 1).padStart(2, '0'),
			day: String(now.getDate()).padStart(2, '0'),
			hour: String(now.getHours()).padStart(2, '0'),
			minutes: String(now.getMinutes()).padStart(2, '0')
		};
		const res = await fetch(fetch_url, { headers: { 'TAM-CLIENT-ID': tamClientID } });
		if (res.ok) {
			const data = await res.json();
			const jsonString = JSON.stringify(data, null, 2);
			const blob = new Blob([jsonString], { type: 'application/json' });
			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = `TAM_${date.year}-${date.month}-${date.day} ${date.hour}:${date.minutes}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}
	}

	async function fileUpload(target) {
		const reader = new FileReader();
		reader.readAsText(uploadFile[0], 'utf-8');
		reader.onload = function (e) {
			contents = String(e.target.result);
		};
		console.log(contents);
		setTimeout(async () => {
			const res = await fetch(`/api/backuprestore/${target}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'TAM-CLIENT-ID': tamClientID },
				body: contents
			});
			if (res.ok) setResult('File uploaded successfully. Check to see if your data exists.');
			else setResult('Error uploading file.');
		}, 100);
	}

	async function pushData(target) {
		const res = await fetch(`/api/backuprestore/push/${target}`, {
			method: 'HEAD',
			headers: { 'TAM-CLIENT-ID': tamClientID }
		});
		const targetStr = target.charAt(0).toUpperCase() + target.slice(1);
		if (res.ok) {
			setResult(`${targetStr} pushed successfully.`);
		} else {
			setResult(`Error pushing ${targetStr}. Error [${res.status}] ${res.statusText}.`);
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<div id="app_container" class="p-1">
	<HeaderBar>
		<a href={resolve('/settings')} class={bS.gray}>Back to Settings</a>
		<div>Other Settings</div>
		<a href={resolve('/settings/prefixes')} class={bS.gray}>Prefixes</a>
		{#if remoteServer}
			<a href={resolve('/settings/auth-keys')} class={bS.gray}>Auth Keys</a>
		{/if}
	</HeaderBar>
	<h1 class="text-xl font-bold">{pageTitle}</h1>
	<div class="my-1 p-1 border border-black rounded">
		<h2 class="text-lg font-bold">Backup File Downloads</h2>
		<div class="flex flex-row gap-1">
			<button class={bS.gray} onclick={downloadBackupFile('local')}>Local Data</button>
			{#if remoteServer}
				<button class={bS.gray} onclick={downloadBackupFile('remote')}>Remote Data</button>
			{/if}
		</div>
	</div>
	<div class="my-1 p-1 border border-black rounded">
		<h2 class="text-lg font-bold">Backup File Upload</h2>
		<div class="flex flex-row gap-1 items-center">
			<input
				type="file"
				accept=".json"
				class="{iS.normal} rounded file:bg-gray-300 file:border file:border-black file:px-2 file:py-1 file:rounded"
				bind:files={uploadFile}
			/>
			{#if !remoteServer}
				<button class={bS.gray} onclick={() => fileUpload('local')}>Upload to Local</button>
			{/if}
			{#if remoteServer}
				<button class={bS.gray} onclick={() => fileUpload('remote')}>Upload to Remote</button>
			{/if}
		</div>
	</div>
	{#if remoteServer}
		<div class="my-1 p-1 border border-black rounded">
			<h2 class="text-lg font-bold">Push Data to Server</h2>
			<div class="flex flex-row gap-1">
				<button class={bS.gray} onclick={() => pushData('prefixes')}>Push Prefixes</button>
				<button class={bS.gray} onclick={() => pushData('tickets')}>Push Tickets</button>
				<button class={bS.gray} onclick={() => pushData('baskets')}>Push Baskets</button>
			</div>
		</div>
	{/if}
	<div class="my-1 p-1 border border-black rounded">
		<span class="font-bold">Status: </span><span>{results}</span>
	</div>
</div>
