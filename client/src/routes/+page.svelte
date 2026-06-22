<script>
    import { tS, bS } from '$lib/client/styles.js';
    import { browser } from '$app/environment';
    import { resolve } from '$app/paths';
    import hotkeys from 'hotkeys-js';

    const pageTitle = 'Main Menu | TAM'
    const { data } = $props();
    let adminMode = $state(false);

    const status = $derived.by(() => {
      if (data.whoami === 'TAM Server') {
        return {
          mode: 'Remote',
          auth: data.authenticated ? 'green' : 'red',
          healthy: data.healthy ? 'green' : 'red'
        };
      } else if (data.whoami === 'TAM Client') {
        return {
          mode: 'Standalone'
        };
      } else {
        return {
          mode: 'Unknown'
        }
      }
    })

    if (browser) {
      hotkeys.filter = () => {return true};
      hotkeys('alt+a', (event) => {
        event.preventDefault();
        adminMode = !adminMode;
      })
    }
</script>

<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<div class="p-1" id="app_container">
<h1 class="text-xl font-bold">{pageTitle}</h1>
<p class="text-lg italic">{data.venueName}</p>

{#if adminMode}
<div id="admin_mode">
    <h2 class="text-lg font-bold">Admin Mode:</h2>
    <div class="flex flex-row gap-1">
        <a href={resolve('/settings')} class={bS.gray}>Settings</a>
    </div>
</div>
{/if}

<div id="footer">
    <div>Mode: {status.mode}</div>
    {#if data.authenticated !== undefined}
    <div>Authenticated: <span class={tS[status.auth]}>{data.authenticated ? 'Yes' : 'No'}</span></div>
    {/if}
    {#if data.healthy !== undefined}
    <div>Server Healthy: <span class={tS[status.healthy]}>{data.healthy ? 'Yes' : 'No'}</span></div>
    {/if}
</div>
</div>
