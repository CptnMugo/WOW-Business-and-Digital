import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
await build({entryPoints:['scripts/test-cohort-render.tsx'],bundle:true,platform:'node',format:'cjs',packages:'external',loader:{'.css':'empty'},outfile:'build/test-cohort-render.cjs'});
execFileSync(process.execPath,['build/test-cohort-render.cjs'],{stdio:'inherit'});
