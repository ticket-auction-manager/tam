<script>
	import { bS } from '../styles';
	import { browser } from '$app/environment';
	import hotkeys from 'hotkeys-js';

	let { prefix, functions } = $props();

	if (browser) {
		hotkeys.filter = () => {
			return true;
		};
		hotkeys('alt+l', (e) => {
			e.preventDefault();
			if (functions.nextLine) functions.nextLine();
		});
		hotkeys('alt+o', (e) => {
			e.preventDefault();
			if (functions.prevLine) functions.prevLine();
		});
		hotkeys('alt+j', (e) => {
			e.preventDefault();
			if (functions.dupDown) functions.dupDown();
		});
		hotkeys('alt+u', (e) => {
			e.preventDefault();
			if (functions.dupUp) functions.dupUp();
		});
		hotkeys('alt+c', (e) => {
			e.preventDefault();
			if (functions.copy) functions.copy();
		});
		hotkeys('alt+v', (e) => {
			e.preventDefault();
			if (functions.paste) functions.paste();
		});
		hotkeys('alt+s', (e) => {
			e.preventDefault();
			if (functions.save) functions.save();
		});
	}
</script>

<div class="flex flex-row gap-1 py-1 justify-between">
	<div class="flex flex-row gap-1">
		{#if functions.dupDown}
			<button class={bS[prefix.color]} title="Alt + J" onclick={() => functions.dupDown()}
				>Duplicate Down</button
			>
		{/if}
		{#if functions.dupUp}
			<button class={bS[prefix.color]} title="Alt + U" onclick={() => functions.dupUp()}
				>Duplicate Up</button
			>
		{/if}
		{#if functions.nextLine}
			<button class={bS[prefix.color]} title="Alt + L" onclick={() => functions.nextLine()}
				>Next Line</button
			>
		{/if}
		{#if functions.prevLine}
			<button class={bS[prefix.color]} title="Alt + O" onclick={() => functions.prevLine()}
				>Previous Line</button
			>
		{/if}
		{#if functions.copy}
			<button class={bS[prefix.color]} title="Alt + C" onclick={() => functions.copy()}>Copy</button
			>
		{/if}
		{#if functions.paste}
			<button class={bS[prefix.color]} title="Alt + V" onclick={() => functions.paste()}
				>Paste</button
			>
		{/if}
	</div>
	<div class="flex flex-row gap-1">
		{#if functions.save}
			<button class={bS[prefix.color]} title="Alt + S" onclick={() => functions.save()}
				>Save Marked</button
			>
		{/if}
	</div>
</div>
