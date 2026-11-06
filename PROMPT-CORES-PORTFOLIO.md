Cadu aqui. Quero atualizar as cores do portfólio e deixar ele mais profissional, sem nada de cara de IA. Leia o `CLAUDE.md` e a base de design em `..\Empresa Engrenagem Tech\Documentos\Design - base\LEIA-ME.md` (abra também `paletas\B - Midnight, Cobalto e Lima.html` no navegador).

# 1. Skills de design
Instale e use: `frontend-design` (Anthropic, `anthropics/skills`) e `web-design-guidelines` (Vercel, `vercel-labs/agent-skills`). Leia o `SKILL.md` de cada uma antes e me avise se alguma pedir algo estranho. Se o comando de instalar mudou, pesquise o atual.

# 2. Cores
O site da Engrenagem usa a paleta A (laranja cantalupo de destaque). O portfólio é o meu lado dev, então usa a **paleta B**, pra cada um ter a sua cara.
- **Fica como está:** fundo `#04070D`, texto `#E9F2FF`, o cinza `#8FA3BF` e o ciano `#22E6FF` (cor principal, e das partículas e da logo CR). No tema claro, o mesmo esquema que já existe.
- **Sai:** o roxo `--color-accent-2` (`#7A6BFF` no escuro, `#5B4BDB` no claro) e qualquer outro roxo ou gradiente roxo, inclusive nas partículas e nos jogos se tiver.
- **Entra, da paleta B:**
  - **verde lima `#D4FF24`** como destaque no tema escuro (um detalhe, um status "disponível", uma palavra), sempre com texto escuro em cima e usado pouco;
  - **azul cobalto `#1558C9`** como apoio (botão com texto branco); pra texto e link no escuro use `#5B93F5`.
  - No **tema claro** o lima some (contraste 1,2:1 com branco): troque por um verde-oliva escuro que passe 4,5:1 (por exemplo `#4D6600`) e use o cobalto `#1558C9`.
- Confira o contraste de tudo nos dois temas (mínimo 4,5:1 em texto normal).
- Não mexer: as 3 bolinhas coloridas das janelas de print (`#ff5f57` / `#febc2e` / `#28c840`).

# 3. Mais profissional, sem cara de IA
Revise o portfólio inteiro (textos, layout, efeitos, animações, intro, partículas) e me traga a lista do que parece genérico ou de IA, com o porquê e a sua sugestão. Ajuste pequeno (espaçamento, hierarquia, contraste, um texto mais direto): pode fazer. Mudança que muda a cara (seção, fonte, intro, partículas): me mostre o antes e depois em print e espere o meu ok. Continua valendo: só afirmar o que está no `Minha_trajetoria_completa.md`.

# 4. Como trabalhar
- Primeiro o plano, depois o código.
- Antes e depois em print com Playwright, no celular (390 px) e no PC (1280 px), nos dois temas.
- Rode a revisão do `web-design-guidelines` e o Lighthouse no fim; o desempenho no celular não pode cair.
- Como diz o `CLAUDE.md`: você não roda `git commit` nem `git push`, me entrega o texto do commit, e nada vai pro ar sem o meu ok.
- Atualize o `CLAUDE.md` com as cores novas e termine me dizendo o que ficou pronto, onde está e o que falta.
