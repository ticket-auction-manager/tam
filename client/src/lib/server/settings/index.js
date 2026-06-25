import { env } from '$env/dynamic/private';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const defaultSettings = {
	remote_server: '',
	remote_key: '',
	remote_port: '8000',
	remote_tls: false,
	default_pref: 'CALL',
	venue_name: 'TAM'
};

export const getSettings = () => {
	const settingsPath = (env.TAM_DATA_DIR || './data') + '/settings.json';
	try {
		const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
		return settings;
	} catch {
		mkdirSync(env.TAM_DATA_DIR || './data', { recursive: true });
		writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
		return defaultSettings;
	}
};

export const setSettings = (nS) => {
	const settingsPath = (env.TAM_DATA_DIR || './data') + '/settings.json';
	const cS = getSettings();
	const newSettings = JSON.stringify({ ...cS, ...nS }, null, 2);
	writeFileSync(settingsPath, newSettings, 'utf-8');
	return 'Settings written successfully!';
};

export const getPath = (sO) => {
	if (!sO.remote_server) return undefined;
	const prefix = sO.remote_tls ? 'https://' : 'http://';
	const connStr = prefix + sO.remote_server + ':' + sO.remote_port;
	return connStr;
};
