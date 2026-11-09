# ovictorlab — laboratório aberto

Portfólio estático de Victor Sodré, com a identidade do [ovictorlab](https://ovictorlab.com), experiências interativas, ferramentas e código público.

## Desenvolvimento

Requer Node.js 22 ou superior apenas para gerar o HTML. A página publicada não usa framework, API do GitHub, cookies nem armazenamento do navegador.

```sh
node scripts/build.mjs
python3 -m http.server 3101 --bind 127.0.0.1
```

Edite `index.template.html`, `assets/site.css` e `assets/site.js`. O gerador produz `index.html` com os projetos já presentes no HTML e atualiza `sitemap.xml`. Sem JavaScript, os projetos e os links continuam disponíveis; busca e filtros são melhoria progressiva.

## Catálogo e assets

`data/projects.json` é uma cópia do catálogo público de `ovictorlab-com`, exportada pelo script `scripts/export-projects.mjs` daquele repositório. Para sincronizar a partir do checkout vizinho:

```sh
node ../ovictorlab-com/scripts/export-projects.mjs "$PWD/data/projects.json"
cp ../ovictorlab-com/public/img/projects/*.webp assets/projects/
node scripts/build.mjs
```

Antes de adicionar projetos, conferir repositório público, demo e descrição no README de origem. Não carregar repositórios privados nem depender de chamadas à API no navegador. Preservar os projetos anteriores e não inventar métricas de uso.

Capas: capturas reais dos experimentos. Destaque: captura da cena do projeto Itaipu. A sonda Voyager usa o modelo NASA / Michael D. Carbajal, com créditos completos no projeto. Marca: símbolo e tipografia oficiais do ovictorlab. Fontes locais sob OFL; licenças em `assets/licenses/`.

## Verificação e publicação

- `node --check assets/site.js` e `node scripts/build.mjs`.
- Conferir desktop e celular: navegação, teclado, busca sem acentos, filtros combinados, estado vazio e imagens.
- Conferir o catálogo sem JavaScript e com movimento reduzido.
- Preservar `googleb5ae7a2d8db66c64.html` e `robots.txt`.
- Publicação pelo GitHub Pages, após revisão do diff e autorização para commit/push.
