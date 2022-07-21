"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[827],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),u=c(n),d=r,h=u["".concat(l,".").concat(d)]||u[d]||m[d]||o;return n?a.createElement(h,i(i({ref:t},s),{},{components:n})):a.createElement(h,i({ref:t},s))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=u;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p.mdxType="string"==typeof e?e:r,i[1]=p;for(var c=2;c<o;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},2175:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>p,toc:()=>c});var a=n(7462),r=(n(7294),n(3905));const o={title:"Usage"},i=void 0,p={unversionedId:"usage",id:"usage",title:"Usage",description:"Each api rules can be used in a chainable or individual way.",source:"@site/docs/usage.md",sourceDirName:".",slug:"/usage",permalink:"/ngx-schematics-utilities/usage",draft:!1,editUrl:"https://github.com/DSI-HUG/ngx-schematics-utilities/edit/main/docs/docs/usage.md",tags:[],version:"current",frontMatter:{title:"Usage"},sidebar:"docs",previous:{title:"Installation",permalink:"/ngx-schematics-utilities/"},next:{title:"Core",permalink:"/ngx-schematics-utilities/apis/core"}},l={},c=[{value:"Chainable usage",id:"chainable-usage",level:3},{value:"<code>Workspace</code>",id:"workspace",level:4},{value:"<code>Application</code>",id:"application",level:4},{value:"<code>Library</code>",id:"library",level:4},{value:"Individual usage",id:"individual-usage",level:3}],s={toc:c};function m(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Each api rules can be used in a ",(0,r.kt)("a",{parentName:"p",href:"#chainable-usage"},(0,r.kt)("strong",{parentName:"a"},"chainable"))," or ",(0,r.kt)("a",{parentName:"p",href:"#individual-usage"},(0,r.kt)("strong",{parentName:"a"},"individual"))," way."),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"Currently, ",(0,r.kt)("inlineCode",{parentName:"p"},"ng add")," does not provide a way to choose which project you want a schematic to be used on.",(0,r.kt)("br",null),"\nTo provide such an option you will have to declare the following ",(0,r.kt)("inlineCode",{parentName:"p"},"project")," property, inside your ",(0,r.kt)("inlineCode",{parentName:"p"},"schema.json")," file:"),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-json"},'"project": {\n  "type": "string",\n  "description": "The name of the project.",\n  "$default": {\n    "$source": "projectName"\n  }\n}\n')),(0,r.kt)("p",{parentName:"admonition"},"Users will then be able to provide a ",(0,r.kt)("inlineCode",{parentName:"p"},"project")," along your schematic installation:",(0,r.kt)("br",null),"\n",(0,r.kt)("em",{parentName:"p"},"(and if they do not, the default provider will populate the project option based on the inferred project from the cwd)")),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"ng add YourSchematic --project ProjectName\n"))),(0,r.kt)("h3",{id:"chainable-usage"},"Chainable usage"),(0,r.kt)("h4",{id:"workspace"},(0,r.kt)("inlineCode",{parentName:"h4"},"Workspace")),(0,r.kt)("p",null,"Allow you to act at the ",(0,r.kt)("em",{parentName:"p"},"workspace")," level."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6-10}","{6-10}":!0},"import { schematic, workspace } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    workspace()\n      .spawn('ng', ['add', '@angular/material', '--skip-confirmation'])\n      .addPackageJsonDevDependencies(['eslint'])\n      .packageInstallTask()\n      .toRule()\n  ], options);\n")),(0,r.kt)("h4",{id:"application"},(0,r.kt)("inlineCode",{parentName:"h4"},"Application")),(0,r.kt)("p",null,"Allow you to act at a ",(0,r.kt)("em",{parentName:"p"},"project")," level and make sure the specified project is an ",(0,r.kt)("em",{parentName:"p"},"application"),"."),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},(0,r.kt)("inlineCode",{parentName:"p"},"__SRC__")," will be interpolated with the project ",(0,r.kt)("strong",{parentName:"p"},"sourceRoot")," specified in the ",(0,r.kt)("strong",{parentName:"p"},"angular.json")," file.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6-14}","{6-14}":!0},"import { application, ChainableProjectContext, createOrUpdateFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    application(options.project)\n      .addImportToFile('__SRC__/main.ts', 'environment', './environments/environment')\n      .rule(({ project }: ChainableProjectContext) => {\n        return createOrUpdateFile(project.pathFromRoot('README.md'), project.name);\n      })\n      .isAngularVersion('<= 11', () => {\n        ...\n      })\n      .toRule()\n  ], options);\n")),(0,r.kt)("h4",{id:"library"},(0,r.kt)("inlineCode",{parentName:"h4"},"Library")),(0,r.kt)("p",null,"Allow you to act at a ",(0,r.kt)("em",{parentName:"p"},"project")," level and make sure the specified project is a ",(0,r.kt)("em",{parentName:"p"},"library"),"."),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},(0,r.kt)("inlineCode",{parentName:"p"},"__SRC__")," will be interpolated with the project ",(0,r.kt)("strong",{parentName:"p"},"sourceRoot")," specified in the ",(0,r.kt)("strong",{parentName:"p"},"angular.json")," file.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6-8}","{6-8}":!0},"import { library, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    library(options.project)\n      .downloadFile('https://my-cdn.com/icons/iconx.png', '__SRC__/assets/icons/icon.png')\n      .toRule()\n  ], options);\n")),(0,r.kt)("h3",{id:"individual-usage"},"Individual usage"),(0,r.kt)("admonition",{title:"Caution",type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"When used this way all the paths will be relative to the root of the workspace.",(0,r.kt)("br",null),"\nYou will have to make sure any modifications on a project are made in a generic way.",(0,r.kt)("br",null),"\nTo help you with that, the ",(0,r.kt)("a",{parentName:"p",href:"/apis/angular#getprojectfromworkspace"},"getProjectFromWorkspace()")," helper is a good start.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6,8,10,12-14,16-17}","{6,8,10,12-14,16-17}":!0},"import { addImportToFile, addPackageJsonDevDependencies, getProjectFromWorkspace, modifyJsonFile, packageInstallTask, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule, Tree } from '@angular-devkit/schematics';\n\nexport default async (options: any): Rule => {\n  async (tree: Tree): Promise<Rule> => {\n    const project = await getProjectFromWorkspace(tree, options.project);\n    return schematic('my-schematic', [\n      modifyJsonFile('tsconfig.json', ['compilerOptions', 'strict'], true),\n\n      addImportToFile(project.pathFromSourceRoot('main.ts'), 'environment', './environments/environment'),\n\n      (): Rule => {\n        ...\n      },\n\n      addPackageJsonDevDependencies(['eslint']),\n      packageInstallTask()\n    ], options);\n  }\n}\n")))}m.isMDXComponent=!0}}]);