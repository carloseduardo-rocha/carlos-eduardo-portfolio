Cadu aqui. A partir de agora este projeto entra no **modo evolução contínua**, igual ao Engrenagem Gestão: você se revisa, se organiza e melhora sozinho, dentro dos limites abaixo. Vale junto com o `CLAUDE.md` deste projeto, e as regras dele vencem se alguma coisa aqui bater de frente.

# 1. Revisão a cada entrega
Ao terminar cada seção, tela, funcionalidade ou decisão importante, antes de me entregar:
1. **Mercado:** como os melhores do tipo resolvem isso hoje? Pesquise na web e abra as páginas que citar. Pegue ideia, nunca copie código, texto, marca ou tela de ninguém.
2. **Código:** segurança, desempenho (Lighthouse, peso das páginas, consultas), acessibilidade (contraste 4,5:1, foco visível, toque de 44 px, teclado), legibilidade e testes faltando.
3. **Visual:** print com Playwright no celular (390 px) e no PC (1280 px), nos temas que existirem, e olhe você mesmo. Rode as skills de design instaladas (`frontend-design`, `web-design-guidelines`). Nada de cara de IA: gradiente roxo, brilho espalhado, frase vaga, emoji como ícone, tudo centralizado e igual.

# 2. O que fazer com o que achar
Registre em `docs/MELHORIAS.md` (uma linha por item, mais recente em cima): data · o que achou · por que é melhor (fonte) · tamanho (P/M/G) · status.
- **Pequeno e seguro** (não muda o que eu pedi nem a cara do projeto): aplique com teste, em commit separado `melhoria: …`, e me conte no resumo.
- **Médio ou grande, ou que muda a cara:** não aplique. Mostre antes e depois em print, prós e contras, e espere o meu ok.
- Decisão de arquitetura vira um registro curto em `docs/decisoes/AAAA-MM-DD-titulo.md`.

# 3. Organização
- Mantenha o `CLAUDE.md` sempre atualizado com o estado real do projeto (o que existe, como roda, decisões).
- A cada fase ou grupo de entregas, releia o projeto com olhos de quem nunca viu e me traga **as 5 melhorias que mais valem a pena**, em ordem, com esforço e ganho.
- Arquivo velho, código morto e dependência sem uso: proponha a limpeza (não apague sem me mostrar). Versão antiga de algo importante vai pra uma pasta `versões antigas/`.

# 4. Divisão do trabalho
Você decide: fazer tudo aqui, usar seus próprios subagentes para tarefas paralelas, ou me pedir pra abrir outro chat quando um trabalho longo precisar de contexto próprio (aí escreva o prompt dele em `docs/chats/<nome>.md`).

# 5. Limites que não mudam
- Segredo nunca vai em arquivo versionado; senha fica no meu Bitwarden.
- Nada vai pro ar e nada de `git push` sem o meu ok (se o `CLAUDE.md` diz que eu mesmo faço o commit, continua assim).
- Não marque nada como pronto com teste falhando; rode você mesmo os comandos que conseguir.
- Só afirme sobre mim o que está no `Currículos\Minha_trajetoria_completa.md`. Nunca invente número, cliente ou depoimento.
- Termine cada etapa me dizendo o que ficou pronto, onde está e o que falta.
