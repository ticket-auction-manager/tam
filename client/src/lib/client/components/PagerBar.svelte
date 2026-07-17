<script>
	import { browser } from '$app/environment';
	import hotkeys from 'hotkeys-js';
	import { bS, iS } from '../styles';

	let { prefix, functions, pager = $bindable() } = $props();

	if (browser) {
		hotkeys.filter = () => {
			return true;
		};
		hotkeys('alt+q', (e) => {
			e.preventDefault();
			const id_from = document.getElementById('id_from');
			if (id_from) id_from.select();
		});
		hotkeys('alt+w', (e) => {
			e.preventDefault();
			const id_to = document.getElementById('id_to');
			if (id_to) id_to.select();
		});
		hotkeys('alt+b', (e) => {
			e.preventDefault();
			if (functions.prevPage) functions.prevPage();
		});
		hotkeys('alt+n', (e) => {
			e.preventDefault();
			if (functions.nextPage) functions.nextPage();
		});
	}
</script>

<div class="flex flex-row justify-between gap-1 p-1">
	<div class="flex flex-row gap-1">
		<input
			type="number"
			id="id_from"
			class={iS.normal}
			title="Alt + Q"
			onclick={(e) => {
				e.target.select();
			}}
			onchange={() => {
			  if (functions.pagerFromUpdate) functions.pagerFromUpdate();
			}}
			bind:value={pager.idFrom}
		/>
		<div>-</div>
		<input
			type="number"
			id="id_to"
			class={iS.normal}
			title="Alt + W"
			onclick={(e) => {
				e.target.select();
			}}
			bind:value={pager.idTo}
		/>
		<button
			class={bS[prefix.color]}
			onclick={() => {
				functions.getPage();
			}}>Go</button
		>
	</div>
	<div class="flex flex-row gap-1">
		{#if functions.prevPage}
			<button
				class={bS[prefix.color]}
				title="Alt + B"
				onclick={() => {
					functions.prevPage();
				}}>Prev Page</button
			>
		{/if}
		{#if functions.nextPage}
			<button
				class={bS[prefix.color]}
				title="Alt + N"
				onclick={() => {
					functions.nextPage();
				}}>Next Page</button
			>
		{/if}
	</div>
</div>
