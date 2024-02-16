"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[98],{3041:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>r,contentTitle:()=>a,default:()=>m,frontMatter:()=>c,metadata:()=>o,toc:()=>l});var i=n(1085),s=n(1184);const c={title:"Core"},a=void 0,o={id:"apis/core",title:"Core",description:"Rules",source:"@site/docs/apis/core.md",sourceDirName:"apis",slug:"/apis/core",permalink:"/ngx-schematics-utilities/apis/core",draft:!1,unlisted:!1,editUrl:"https://github.com/dsi-hug/ngx-schematics-utilities/edit/main/docs/docs/apis/core.md",tags:[],version:"current",frontMatter:{title:"Core"},sidebar:"docs",previous:{title:"Usage",permalink:"/ngx-schematics-utilities/usage"},next:{title:"File",permalink:"/ngx-schematics-utilities/apis/file"}},r={},l=[{value:"Rules",id:"rules",level:2},{value:"<code>schematic</code>",id:"schematic",level:3},{value:"<code>log</code>",id:"log",level:3},{value:"<code>logInfo</code>",id:"loginfo",level:3},{value:"<code>logWarning</code>",id:"logwarning",level:3},{value:"<code>logError</code>",id:"logerror",level:3},{value:"<code>logAction</code>",id:"logaction",level:3},{value:"<code>spawn</code>",id:"spawn",level:3},{value:"Helpers",id:"helpers",level:2},{value:"<code>getSchematicSchemaOptions</code>",id:"getschematicschemaoptions",level:3},{value:"<code>getSchematicSchemaDefaultOptions</code>",id:"getschematicschemadefaultoptions",level:3}];function h(e){const t={admonition:"admonition",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h2,{id:"rules",children:"Rules"}),"\n",(0,i.jsx)(t.h3,{id:"schematic",children:(0,i.jsx)(t.code,{children:"schematic"})}),"\n",(0,i.jsx)(t.p,{children:"Executes a set of rules by outputing first the name of the associated schematic to the console."}),"\n",(0,i.jsx)(t.admonition,{title:"Note",type:"note",children:(0,i.jsx)(t.p,{children:'The schematic name will be prefixed by the word "SCHEMATIC" printed in magenta and given options can follow inlined, stringified and printed in gray if verbose mode is activated.'})}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ts",metastring:"{5-7}",children:"import { schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    ...\n  ]);\n"})}),"\n",(0,i.jsx)(t.h3,{id:"log",children:(0,i.jsx)(t.code,{children:"log"})}),"\n",(0,i.jsx)(t.p,{children:"Outputs a message to the console."}),"\n",(0,i.jsx)(t.admonition,{title:"Note",type:"note",children:(0,i.jsxs)(t.p,{children:["By default, the Angular schematic's logger will misplace messages with breaking indentations.",(0,i.jsx)("br",{}),"\nThis method makes sure that messages are always displayed at the beginning of the current console line."]})}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ts",metastring:"{6}",children:"import { log, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    log('My log message')\n  ]);\n"})}),"\n",(0,i.jsx)(t.h3,{id:"loginfo",children:(0,i.jsx)(t.code,{children:"logInfo"})}),"\n",(0,i.jsx)(t.p,{children:'Outputs a message to the console, prefixed by the word "INFO" printed in blue.'}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ts",metastring:"{6}",children:"import { logInfo, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    logInfo('My info message')\n  ]);\n"})}),"\n",(0,i.jsx)(t.h3,{id:"logwarning",children:(0,i.jsx)(t.code,{children:"logWarning"})}),"\n",(0,i.jsx)(t.p,{children:'Outputs a message to the console, prefixed by the word "WARNING" printed in yellow.'}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ts",metastring:"{6}",children:"import { logWarning, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    logWarning('My warn message')\n  ]);\n"})}),"\n",(0,i.jsx)(t.h3,{id:"logerror",children:(0,i.jsx)(t.code,{children:"logError"})}),"\n",(0,i.jsx)(t.p,{children:'Outputs a message to the console, prefixed by the word "ERROR" printed in red.'}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ts",metastring:"{6}",children:"import { logError, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    logError('My error message')\n  ]);\n"})}),"\n",(0,i.jsx)(t.h3,{id:"logaction",children:(0,i.jsx)(t.code,{children:"logAction"})}),"\n",(0,i.jsx)(t.p,{children:'Outputs a message to the console, prefixed by the word "ACTION" printed in green.'}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ts",metastring:"{6}",children:"import { logAction, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    logAction('My action message')\n  ]);\n"})}),"\n",(0,i.jsx)(t.h3,{id:"spawn",children:(0,i.jsx)(t.code,{children:"spawn"})}),"\n",(0,i.jsx)(t.p,{children:"Spawns a new process using the given command and arguments."}),"\n",(0,i.jsxs)(t.admonition,{title:"Note",type:"note",children:[(0,i.jsxs)(t.p,{children:["By default, the output will not be redirected to the console unless otherwise specified by the ",(0,i.jsx)(t.code,{children:"showOutput"}),"\nparameter or the ",(0,i.jsx)(t.code,{children:"--verbose"})," current schematic process argument."]}),(0,i.jsx)(t.p,{children:"When the output is not redirected to the console, an animated spinner will be displayed to the console to\nindicates the current process activity, as well as the command and its options displayed inlined and printed\nin cyan."})]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ts",metastring:"{7,10}",children:"import { spawn, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // Display an animated spinner along with the command and its arguments\n    spawn('ng', ['add', '@angular/material', '--skip-confirmation']),\n\n    // Display the command outputs directly to the console\n    spawn('npx', ['-p', 'package-name', 'some-command'], true)\n  ]);\n"})}),"\n",(0,i.jsx)(t.h2,{id:"helpers",children:"Helpers"}),"\n",(0,i.jsx)(t.h3,{id:"getschematicschemaoptions",children:(0,i.jsx)(t.code,{children:"getSchematicSchemaOptions"})}),"\n",(0,i.jsx)(t.p,{children:"Returns all the options of a specific local or external schematic's schema."}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ts",metastring:"{9,12,15,18}",children:"import { getSchematicSchemaOptions, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  (tree: Tree, context: SchematicContext): Rule =>\n    schematic('my-schematic', [\n        async(): Rule => {\n            // Get the `ng-add` schema of the current running schematic\n            const opts1 = await getSchematicSchemaOptions(context);\n\n            // Get the `schematic-name` schema of the current running schematic\n            const opts2 = await getSchematicSchemaOptions(context, 'schematic-name'));\n\n            // Get the `ng-add` schema of the local package `@angular/material`\n            const opts3 = await getSchematicSchemaOptions(context, 'ng-add', '@angular/material'));\n\n            // Get the `sentry` schema of the external package `@hug/ngx-sentry` on npm\n            const opts4 = await getSchematicSchemaOptions(context, 'sentry', '@hug/ngx-sentry', true));\n            ...\n        }\n    ]);\n"})}),"\n",(0,i.jsx)(t.h3,{id:"getschematicschemadefaultoptions",children:(0,i.jsx)(t.code,{children:"getSchematicSchemaDefaultOptions"})}),"\n",(0,i.jsx)(t.p,{children:"Returns all the default options of a specific local or external schematic's schema."}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ts",metastring:"{9,12,15,18}",children:"import { getSchematicSchemaDefaultOptions, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  (tree: Tree, context: SchematicContext): Rule =>\n    schematic('my-schematic', [\n        async (): Rule => {\n            // Get the default options from the `ng-add` schema of the current running schematic\n            const opts1 = await getSchematicSchemaDefaultOptions(context);\n\n            // Get the default options from the `schematic-name` schema of the current running schematic\n            const opts2 = await getSchematicSchemaDefaultOptions(context, 'schematic-name'));\n\n            // Get the default options from the `ng-add` schema of the local package `@angular/material`\n            const opts3 = await getSchematicSchemaDefaultOptions(context, 'ng-add', '@angular/material'));\n\n            // Get the default options from the `sentry` schema of the external package `@hug/ngx-sentry` on npm\n            const opts4 = await getSchematicSchemaDefaultOptions(context, 'sentry', '@hug/ngx-sentry', true));\n            ...\n        }\n    ]);\n"})})]})}function m(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},1184:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>o});var i=n(4041);const s={},c=i.createContext(s);function a(e){const t=i.useContext(c);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),i.createElement(c.Provider,{value:t},e.children)}}}]);