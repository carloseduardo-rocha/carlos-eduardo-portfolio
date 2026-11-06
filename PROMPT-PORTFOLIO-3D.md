Cadu aqui. O portfólio vai ser o meu laboratório: quero ele bem mais profissional e impressionante, com 3D e animação de verdade. Se der certo aqui, a mesma ideia vai pro site da Engrenagem e depois vira modelos pra vender (barbearia, comida etc.). Leia antes:
- `INSTRUCAO-EVOLUCAO-PROJETOS.md` (nesta pasta): o modo evolução contínua, que vale a partir de agora;
- `PROMPT-CORES-PORTFOLIO.md` (nesta pasta), se ainda não fez: as cores novas;
- `..\Empresa Engrenagem Tech\Documentos\Design - base\LEIA-ME.md`.

# 1. Skills (instale, leia o SKILL.md de cada uma antes e me avise se alguma pedir algo estranho)
- `frontend-design` (Anthropic) e `web-design-guidelines` (Vercel), se ainda não tiver.
- **Three.js:** as skills de `cloudai-x/threejs-skills` (fundamentos, shaders, materiais, iluminação, pós-processamento, animação, interação). A página do pacote mostra o comando `npx -y skills add cloudai-x/threejs-skills --skill <nome> --agent claude-code`; confira se ainda é esse.
- Se achar uma skill melhor pra GSAP/scroll ou React Three Fiber, pesquise, me diga qual e por quê antes de instalar.
- Fique de olho no peso: o site já usa Three.js e GSAP sob demanda; continue carregando 3D só quando precisa e com plano B quando o WebGL falhar (já existe `html[data-gl="off"]`).

# 2. Referência: ProfitizeBuild
Eu gosto do estilo de https://profitize.com.br/build/templates (biblioteca de prompts de landing pages, componentes 3D, shaders e motion). Eu não assino, então:
- abra só as páginas públicas e os itens marcados "Grátis", com Playwright, e estude a técnica: como o 3D entra, como o scroll conduz a animação, o ritmo, a tipografia, os shaders, o que faz parecer caro;
- **não copie** código, prompt, texto, imagem nem nome de template deles; não tente abrir nada pago. Recrie com ideias nossas;
- me traga um resumo curto: as 5 técnicas que mais valem pro portfólio, com um print de exemplo de cada (só da página pública) e como você faria a nossa versão.

# 3. Por partes (pare e me mostre no fim de cada uma)
1. **Plano:** a partir do resumo acima e do portfólio atual, proponha o que muda (seções, onde entra 3D, animações de scroll, microinterações), em ordem de impacto. Sem código ainda.
2. **Logo CR em 3D:** uma versão mais realista e bonita da logo "CR" (`src/lib/logo.ts`): material metálico ou vidro, luz bem feita, reflexo, leve movimento com o mouse/scroll, sem pesar no celular. Mostre 2 ou 3 variações em print e vídeo curto (gravação do Playwright) pra eu escolher. Não mude a logo do site sem o meu ok.
3. **Hero e intro:** aplicar a melhor ideia no topo do site.
4. **Resto das seções**, uma de cada vez.
Em cada parte: antes e depois em print (390 px e 1280 px, tema claro e escuro), Lighthouse sem perder desempenho no celular, `prefers-reduced-motion` respeitado.

# 4. Modelagem 3D de verdade (depois, só se o passo 2 pedir)
Se precisarmos de um modelo 3D que não dá pra fazer só no código, me explique as opções antes de qualquer instalação: Blender (grátis) com o Blender MCP pra você controlar o Blender, ou um modelo `.glb` exportado e carregado no site. Me diga o que eu teria que instalar no PC e quanto isso custa (de preferência nada).

# 5. Pra virar produto
Enquanto faz, anote em `docs/MODELOS-PARA-VENDA.md` o que daria pra reaproveitar como modelo pra cliente (ex.: hero 3D de barbearia, cardápio com animação), com o que precisaria trocar por cliente (cores, logo, textos, fotos).

Regras do `CLAUDE.md` continuam: você não roda `git commit` nem `git push`, me entrega o texto do commit, e nada vai pro ar sem o meu ok.
