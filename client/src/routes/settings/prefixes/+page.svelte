<script>
	import { onMount } from 'svelte';
	import HeaderBar from '$lib/client/components/HeaderBar.svelte';
	import { bS, bAS, iS } from '$lib/client/styles';
	import { resolve } from '$app/paths';

	let { data } = $props();

	const pageTitle = 'Prefixes | TAM';

	let prefixes = $state([]);
	let editPrefix = $state({ prefix: '', color: 'white', weight: 1 });

	onMount(() => {
		prefixes = [...data.prefixes];
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<HeaderBar>
	<a href={resolve('/settings')} class={bS.gray}>Back to Settings</a>
</HeaderBar>

<div id="app_container" class="p-1">
	<h1 class="text-xl font-bold">{pageTitle}</h1>
	<div class="flex flex-row gap-1 py-1 items-center">
		<div class="flex flex-col gap-1">
			<div>Prefix</div>
			<input type="text" class={iS.normal} bind:value={editPrefix.prefix} />
		</div>
		<div class="flex flex-col gap-1">
			<div>Color</div>
			<select name="prefix_color" class={iS.normal} bind:value={editPrefix.color}>
				<option value="white">White</option>
				<option value="blue">Blue</option>
				<option value="yellow">Yellow</option>
				<option value="green">Green</option>
				<option value="orange">Orange</option>
				<option value="red">Red</option>
			</select>
		</div>
		<div class="flex flex-col gap-1">
			<div>Weight</div>
			<input type="number" class={iS.normal} bind:value={editPrefix.weight} />
		</div>
		<div class="flex flex-col gap-1">
			<div>Actions</div>
			<button
				class={bS[editPrefix.color]}
				onclick={async () => {
					if (editPrefix.prefix) {
						const req = await fetch('/api/prefixes', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify([editPrefix])
						});
						if (req.ok) window.location.reload();
					}
				}}>Add/Change</button
			>
		</div>
	</div>
	<div class="flex flex-row gap-1 py-1 items-center">
		<div>Colors:</div>
		<button
			class={editPrefix.color == 'white' ? bAS.white : bS.white}
			onclick={() => (editPrefix.color = 'white')}>White</button
		>
		<button
			class={editPrefix.color == 'blue' ? bAS.blue : bS.blue}
			onclick={() => (editPrefix.color = 'blue')}>Blue</button
		>
		<button
			class={editPrefix.color == 'yellow' ? bAS.yellow : bS.yellow}
			onclick={() => (editPrefix.color = 'yellow')}>Yellow</button
		>
		<button
			class={editPrefix.color == 'green' ? bAS.green : bS.green}
			onclick={() => (editPrefix.color = 'green')}>Green</button
		>
		<button
			class={editPrefix.color == 'orange' ? bAS.orange : bS.orange}
			onclick={() => (editPrefix.color = 'orange')}>Orange</button
		>
		<button
			class={editPrefix.color == 'red' ? bAS.red : bS.red}
			onclick={() => (editPrefix.color = 'red')}>Red</button
		>
	</div>
	<table class="w-full">
		<thead class="text-left">
			<tr>
				<th>Prefix</th>
				<th>Color</th>
				<th>Weight</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each prefixes as prefix (prefix.prefix)}
				<tr>
					<td>{prefix.prefix}</td>
					<td>{prefix.color.charAt(0).toUpperCase() + prefix.color.slice(1)}</td>
					<td>{prefix.weight}</td>
					<td>
						<div class="flex flex-row gap-1 items-center">
							<button class={bS[prefix.color]} onclick={() => (editPrefix = { ...prefix })}
								>Edit</button
							>
							<button
								class={bS[prefix.color]}
								onclick={async () => {
									const res = await fetch(`/api/prefixes?p=${prefix.prefix}`, {
										method: 'DELETE'
									});
									if (res.ok) window.location.reload();
								}}>Delete</button
							>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	table td,
	table th {
		border: solid black 1px;
		padding: 0.25rem;
	}
</style>
