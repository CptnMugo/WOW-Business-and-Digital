import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs';
import { ProjectSimulationPage } from '../src/components/ProjectSimulationPage';
const output=process.argv[2];
fs.writeFileSync(output,renderToStaticMarkup(<ProjectSimulationPage setActiveTab={()=>{}}/>));
