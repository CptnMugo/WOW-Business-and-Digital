import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const root = process.cwd();
const temporary = fs.mkdtempSync(path.join(root, 'scripts/.admissions-preview-'));
try {
 const server = await build({ stdin: { contents: `import React from 'react'; import { renderToString } from 'react-dom/server'; import { AdmissionsDashboard } from './src/components/AdmissionsDashboard'; import { createDemoAPI, demoApplications } from './src/admissions/demo'; module.exports = renderToString(React.createElement(AdmissionsDashboard, {demo:true,api:createDemoAPI(),initial:demoApplications}));`, resolveDir: root, loader: 'tsx' }, bundle: true, platform: 'node', format: 'cjs', packages: 'external', loader: { '.css': 'empty' }, write: false });
 const renderer = path.join(temporary, 'render.cjs'); fs.writeFileSync(renderer, server.outputFiles[0].text);
 const markup = createRequire(import.meta.url)(renderer);
 const client = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import { AdmissionsDashboard } from './src/components/AdmissionsDashboard'; import { createDemoAPI, demoApplications } from './src/admissions/demo'; createRoot(document.getElementById('root')).render(React.createElement(AdmissionsDashboard,{demo:true,api:createDemoAPI(),initial:demoApplications}));`, resolveDir: root, loader: 'tsx' }, bundle: true, minify: true, format: 'iife', loader: { '.css': 'empty' }, write: false, define: { 'process.env.NODE_ENV': '"production"' } });
 const font = fs.readFileSync('public/fonts/Montserrat-Variable.ttf').toString('base64');
 const css = fs.readFileSync('src/admissions/dashboard.css', 'utf8');
 const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>WOW Applications Dashboard | Private preview</title><style>@font-face{font-family:Montserrat;src:url(data:font/ttf;base64,${font}) format('truetype');font-weight:100 900}body{margin:0}${css}</style></head><body><div id="root">${markup}</div><noscript><p>Enable JavaScript to try the demo controls. This page contains fictional data only.</p></noscript><script>${client.outputFiles[0].text.replace(/<\/script/gi, '<\\/script')}</script></body></html>`;
 const target = path.resolve(root, '../WBD_Applications_Dashboard_Preview.html'); fs.writeFileSync(target, html); console.log(target);
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
