import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const { projects, verifiedAt } = JSON.parse(await readFile(new URL('data/projects.json', root), 'utf8'));
const template = await readFile(new URL('index.template.html', root), 'utf8');
const escape = (text) => String(text).replace(/[&<>"']/g, (value) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[value]));
const safeUrl = (value) => {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Public links must use HTTPS.');
  return escape(value);
};
const kinds = { interativo:'Experiência interativa', '3d':'Exploração 3D', ferramenta:'Ferramenta', catalogo:'Catálogo aberto', benchmark:'Benchmark' };
const card = (p) => {
  const destination = safeUrl(p.liveUrl ?? p.packageUrl ?? p.repoUrl);
  const image = p.image ? `<img src="assets/projects/${escape(p.slug)}.webp" alt="${escape(p.imageAlt ?? p.name)}" width="960" height="540" loading="lazy" decoding="async">` : `<div class="code-cover" aria-hidden="true"><span>${p.kind === '3d' ? '3D' : '&lt;/&gt;'}</span><small>${escape(p.stack.slice(0,2).join(' / '))}</small></div>`;
  return `<article class="project" data-project="${escape(p.slug)}" data-kind="${escape(p.kind)}" data-search="${escape([p.name,p.summary,p.topic,...p.stack].join(' '))}">
    <a class="project-cover" href="${destination}" tabindex="-1" aria-hidden="true">${image}</a>
    <p class="project-topic">${escape(p.topic ?? kinds[p.kind])}</p>
    <h3><a href="${destination}">${escape(p.name)}</a></h3>
    <p class="project-summary">${escape(p.summary)}</p>
    <div class="project-actions"><a href="${destination}" aria-label="Explorar ${escape(p.name)}">${p.liveUrl ? 'Explorar' : p.packageUrl ? 'Ver no npm' : 'Ver projeto'} ↗</a><a href="${safeUrl(p.repoUrl)}" aria-label="Código de ${escape(p.name)} no GitHub">GitHub ↗</a><a href="https://ovictorlab.com/codigo/${escape(p.slug)}" aria-label="Sobre ${escape(p.name)}">Sobre →</a></div>
  </article>`;
};
if (new Set(projects.map((p) => p.slug)).size !== projects.length) throw new Error('Duplicate project slugs.');
const schema = JSON.stringify({ '@context':'https://schema.org','@type':'CollectionPage',name:'Projetos do ovictorlab',url:'https://victorsodre.github.io/',inLanguage:'pt-BR',author:{'@type':'Person',name:'Victor Sodré',url:'https://ovictorlab.com'},mainEntity:{'@type':'ItemList',numberOfItems:projects.length,itemListElement:projects.map((p,index)=>({'@type':'ListItem',position:index+1,item:{'@type':'SoftwareSourceCode',name:p.name,url:p.liveUrl??p.repoUrl,codeRepository:p.repoUrl,description:p.summary}}))}}).replace(/</g,'\\u003c');
const output = template.replace('{{PROJECTS}}',projects.map(card).join('\n')).replaceAll('{{COUNT}}',String(projects.length)).replace('{{SCHEMA}}',schema).replace('{{YEAR}}',verifiedAt.slice(0,4));
if (/\{\{[A-Z]+\}\}/.test(output)) throw new Error('Unresolved template field.');
await writeFile(new URL('index.html', root),output);
const urls = ['https://victorsodre.github.io/', ...projects.flatMap((p)=>p.liveUrl?.startsWith('https://victorsodre.github.io/') ? [p.liveUrl.split('?')[0]] : [])];
await writeFile(new URL('sitemap.xml',root),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(urls)].map((url)=>`  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${projects.length} static project entries.`);
