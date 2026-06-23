<script>
	import { resolve } from '$app/paths';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { bS, bAS, iS } from '$lib/client/styles';
	import HeaderBar from '$lib/client/components/HeaderBar.svelte';
	import PagerBar from '$lib/client/components/PagerBar.svelte';
	import CommandBar from '$lib/client/components/CommandBar.svelte';

	let { data } = $props();
	let { prefix, prefixes } = $derived(data);

	let pageTitle = $derived(`${prefix.prefix} Tickets | TAM`);

	let curIdx = $state(0),
		nextIdx = $derived(curIdx + 1),
		prevIdx = $derived(curIdx - 1);
	const changeIdx = (idx) => {
		curIdx = idx;
	};
	const focusIdx = (idx) => {
		curIdx = idx;
		const elemIdx = document.getElementById(`${idx}_first`);
		if (elemIdx) {
			elemIdx.focus();
		}
	};

	let pager = $state({ idFrom: 0, idTo: 0 });
	let items = $state([]);
	let itemsLength = $derived(items.length);
	let itemsBuffer = $derived(items.filter((i) => i.changed));
	const functions = {
		getPage: async () => {
			functions.save();
			if (pager.idFrom > pager.idTo) {
				[pager.idFrom, pager.idTo] = [pager.idTo, pager.idFrom];
			}
			if (pager.idTo - pager.idFrom > 300) {
				pager.idTo = pager.idFrom + 300;
			}
			const res = await fetch(`/api/tickets/${prefix.prefix}/${pager.idFrom}/${pager.idTo}`);
			const resData = await res.json();
			resData.map((i) => (i.changed = false));
			items = [...resData];
			setTimeout(() => focusIdx(0));
		},
		save: async () => {
			if (itemsBuffer.length > 0) {
				const res = await fetch('/api/tickets', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(itemsBuffer)
				});
				if (res.ok) {
					itemsBuffer.forEach((i) => (i.changed = false));
				} else {
					alert('Error saving items.');
				}
			}
			setTimeout(() => {
				focusIdx(0);
			}, 1);
		},
		prevPage: () => {
			((pager.idFrom -= itemsLength), (pager.idTo -= itemsLength));
			functions.getPage();
		},
		nextPage: () => {
			((pager.idFrom += itemsLength), (pager.idTo += itemsLength));
			functions.getPage();
		},
		nextLine: () => {
			if (items[nextIdx]) {
				setTimeout(() => {
					focusIdx(nextIdx);
				}, 1);
			} else {
			    setTimeout(() => {
					focusIdx(curIdx);
				}, 1)
			}
		},
		prevLine: () => {
		    if (items[prevIdx]) {
				setTimeout(() => {
				  focusIdx(prevIdx);
				}, 1);
			} else {
			    setTimeout(() => {
					focusIdx(curIdx)
				}, 1);
			};
		},
		dupDown: () => {
		    if (items[nextIdx]) {
				const buffer = {...items[curIdx]};
				["prefix", "t_id"].forEach(key => delete buffer[key]);
				items[nextIdx] = {...items[nextIdx], ...buffer, changed: true};
				functions.nextLine();
			} else {
			    focusIdx(curIdx);
			}
		},
		dupUp: () => {
		    if (curIdx > 0) {
			    const buffer = {...items[curIdx]};
				["prefix", "t_id"].forEach(key => delete buffer[key]);
				items[prevIdx] = {...items[prevIdx], ...buffer, changed: true};
				functions.prevLine();
			} else {
			  focusIdx(curIdx);
			}
		},
		copy: () => {
		    if (items[curIdx]) {
				const buffer = {...items[curIdx]};
				["prefix", "t_id"].forEach(key => delete buffer[key]);
				window.localStorage.setItem('tam-ticket', JSON.stringify(buffer));
			};
			focusIdx(curIdx);
		},
		paste: () => {
		    if (items[curIdx]) {
				const buffer = JSON.parse(window.localStorage.getItem('tam-ticket'));
				items[curIdx] = {...items[curIdx], ...buffer, changed: true};
			};
			focusIdx(curIdx);
		}
	};
	const headers = ['Ticket ID', 'First Name', 'Last Name', 'Phone Number', 'Pref', 'Save?'];

	beforeNavigate(({ cancel }) => {
		if (itemsBuffer.length > 0) {
			if (!confirm('Are you sure you want to leave this page? There are unsaved changes!'))
				cancel();
		}
	});

	afterNavigate(() => {
		items = [];
		pager = { idFrom: 0, idTo: 0 };
		curIdx = 0;
	});

	if (browser) {
		window.addEventListener('beforeunload', (e) => {
			if (itemsBuffer.length > 0) e.preventDefault();
		});
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<table class="w-full box-border border-separate">
	<thead class="sticky top-1 box-border bg-white">
		<tr>
			<td colspan="50">
				<HeaderBar>
					<div>Tickets:</div>
					{#each prefixes as p (p.prefix)}
						<a
							href={resolve('/tickets/[prefix]', { prefix: p.prefix })}
							class={prefix.prefix == p.prefix ? bAS[p.color] : bS[p.color]}>{p.prefix}</a
						>
					{/each}
				</HeaderBar>
			</td>
		</tr>
		<tr>
			<td colspan="50"><h1 class="text-xl font-bold p-1">{pageTitle}</h1></td>
		</tr>
		<tr>
			<td colspan="50"><PagerBar {prefix} {functions} bind:pager /></td>
		</tr>
		<tr>
			<td colspan="50"><CommandBar {prefix} {functions} /></td>
		</tr>
		<tr>
			{#each headers as header (header)}
				<th class="border text-left p-0.5">{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each items as item, idx (item.t_id)}
			<tr
				class="focus-within:font-bold"
				onfocusin={(e) => {
					changeIdx(idx);
					e.target.scrollIntoView({ block: 'center' });
				}}
			>
				<td class="p-0.5 border">{item.t_id}</td>
				<td class="p-0.5 border"
					><input
						type="text"
						class="{iS.normal} w-full"
						id="{idx}_first"
						onchangecapture={() => (item.changed = true)}
						bind:value={item.first_name}
					/></td
				>
				<td class="p-0.5 border"
					><input
						type="text"
						class="{iS.normal} w-full"
						onchangecapture={() => (item.changed = true)}
						bind:value={item.last_name}
					/></td
				>
				<td class="p-0.5 border"
					><input
						type="text"
						class="{iS.normal} w-full"
						onchangecapture={() => (item.changed = true)}
						bind:value={item.phone_number}
					/></td
				>
				<td class="p-0.5 border"
					><button
						class={bS[prefix.color]}
						onclick={() => {
							item.pref == 'CALL' ? (item.pref = 'TEXT') : (item.pref = 'CALL');
							item.changed = true;
						}}>{item.pref}</button
					></td
				>
				<td class="p-0.5 border"
					><button
						class={bS[prefix.color]}
						onclick={() => {
							item.changed ? (item.changed = false) : (item.changed = true);
						}}>{item.changed ? 'Yes' : 'No'}</button
					></td
				>
			</tr>
		{/each}
	</tbody>
</table>
