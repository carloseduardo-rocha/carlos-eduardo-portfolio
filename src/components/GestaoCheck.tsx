import { useInView } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useRef, useState } from 'react'
import { Chip } from '@/components/Chip'
import { Counter } from '@/components/Counter'
import { SectionHeading } from '@/components/SectionHeading'
import shots from '@/data/gestaocheck-shots.json'
import { useTheme } from '@/lib/useTheme'

type ShotKey = keyof typeof shots

/** Real screenshots of the product (demo data). Descriptions only state what is visible on screen. */
const tabs = [
  {
    id: 'inicio',
    label: 'Início',
    desc: 'Painel inicial com atalhos para os módulos (CMV, Contagem, CMO, Caixa, Avarias, CMC e Relatórios), movimentações recentes e estoque por categoria.',
  },
  {
    id: 'estoque',
    label: 'Estoque',
    desc: 'Contagem do estoque: itens conferidos, pendentes e com divergência, barra de progresso da conferência, busca e filtros por categoria e setor, importação de nota de compra e exportação.',
  },
  {
    id: 'cmv',
    label: 'CMV',
    desc: 'Custo da Mercadoria Vendida: faturamento, custo e margem do período, CMV atual comparado com a meta e abas de itens de venda, ficha técnica, promoções e vendas.',
  },
  {
    id: 'cmo',
    label: 'CMO',
    desc: 'Custo de Mão de Obra: salários, encargos e benefícios por período, custo médio por pessoa, peso sobre o faturamento e evolução mês a mês.',
  },
  {
    id: 'cmc',
    label: 'CMC',
    desc: 'Custo Médio de Compra: compras por fornecedor, categoria e período, ticket médio, maior compra e alertas em relação à meta de compras.',
  },
  {
    id: 'relatorio',
    label: 'Relatórios',
    desc: 'Relatório geral: visão consolidada de todos os módulos, com o financeiro (para onde foi cada R$ 1,00 faturado) e o operacional (avarias, ocorrências, manutenção), filtrável por período e setor.',
  },
] as const

const didList = [
  'Levantei os requisitos junto com os fundadores e defini a arquitetura e a base do sistema, documentada para outro desenvolvedor e para ferramentas de IA darem continuidade.',
  'Desenvolvi o back-end: estoque com entrada por nota fiscal (OCR com Tesseract), custos (CMV, CMO, CMC), produção, permissões por papel e setor e trilha de auditoria.',
  'Acesso protegido com 2FA (TOTP), banco isolado por cliente, testes automatizados em Pytest e deploy com Docker.',
  'Trabalho com engenharia assistida por IA, guiada por documentação técnica.',
]

const features = [
  '2FA (TOTP)',
  'OCR de nota fiscal',
  'Banco isolado por cliente',
  'Auditoria',
  'Permissões por papel e setor',
  'Assistente com IA',
]
const stack = ['Python', 'Flask', 'PostgreSQL', 'Docker', 'Pytest', 'Tesseract']

function ShotViewer() {
  const theme = useTheme()
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)
  const [paused, setPaused] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const inView = useInView(wrap, { margin: '-20% 0px -20% 0px' })

  const tab = tabs[index]
  const key = `${tab.id}-${theme}` as ShotKey
  const [layers, setLayers] = useState<{ cur: ShotKey; prev: ShotKey | null }>({ cur: key, prev: null })

  // slow auto-tour while the viewer is on screen; stops for good once the visitor takes control
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!auto || paused || !inView || reduced) return
    const id = window.setInterval(() => setIndex((v) => (v + 1) % tabs.length), 4200)
    return () => window.clearInterval(id)
  }, [auto, paused, inView])

  // keep the old screenshot visible until the new one has decoded, then cross-fade
  useEffect(() => {
    if (key === layers.cur) return
    let cancelled = false
    const img = new Image()
    img.src = `/gestaocheck/${key}.webp`
    const swap = () => {
      if (!cancelled) setLayers((l) => ({ cur: key, prev: l.cur }))
    }
    img.decode().then(swap, swap)
    return () => {
      cancelled = true
    }
  }, [key, layers.cur])

  const choose = (i: number) => {
    setIndex((i + tabs.length) % tabs.length)
    setAuto(false)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') choose(index + 1)
    else if (e.key === 'ArrowLeft') choose(index - 1)
    else return
    e.preventDefault()
    document.getElementById(`gc-tab-${tabs[(index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length].id}`)?.focus()
  }

  const src = (k: ShotKey) => `/gestaocheck/${k}.webp`
  const themeLabel = theme === 'dark' ? 'tema escuro' : 'tema claro'

  return (
    <div
      ref={wrap}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative">
        <div className="overflow-hidden rounded-2xl border border-line bg-bg/60 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] md:backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-muted">
              gestãocheck · {tab.label}
            </span>
          </div>
          <div
            role="tabpanel"
            id="gc-panel"
            aria-labelledby={`gc-tab-${tab.id}`}
            className="relative aspect-[1210/735] bg-bg/40"
          >
            {layers.prev && (
              <img
                src={src(layers.prev)}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            )}
            <m.img
              key={layers.cur}
              src={src(layers.cur)}
              alt={`${tab.label} do GestãoCheck (${themeLabel}). ${tab.desc}`}
              width={shots[layers.cur].w}
              height={shots[layers.cur].h}
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>
        </div>

        <figure className="absolute -bottom-7 right-3 w-[27%] overflow-hidden rounded-xl border border-line bg-bg shadow-[0_18px_40px_-14px_rgb(0_0_0/0.6)] md:-right-3">
          <img
            src="/gestaocheck/mobile-inicio.webp"
            alt="Painel inicial do GestãoCheck no celular, com clima, contagens realizadas e valor total em estoque."
            width={shots['mobile-inicio'].w}
            height={shots['mobile-inicio'].h}
            loading="lazy"
            decoding="async"
            className="block w-full"
          />
          <figcaption className="border-t border-line px-2 py-1 text-center font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted">
            Mobile
          </figcaption>
        </figure>
      </div>

      <div
        role="tablist"
        aria-label="Telas do GestãoCheck"
        onKeyDown={onKeyDown}
        className="mt-12 flex flex-wrap gap-2"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`gc-tab-${t.id}`}
            aria-selected={i === index}
            aria-controls="gc-panel"
            tabIndex={i === index ? 0 : -1}
            onClick={() => choose(i)}
            className={`cursor-pointer rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              i === index
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-line text-muted hover:border-accent/60 hover:text-fg'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* all descriptions share one grid cell, so the box is as tall as the longest one and never jumps */}
      <div className="mt-3 grid text-sm leading-relaxed text-muted" aria-live="polite">
        {tabs.map((t) => (
          <p
            key={t.id}
            aria-hidden={t.id !== tab.id}
            className={`col-start-1 row-start-1 ${t.id === tab.id ? '' : 'invisible'}`}
          >
            {t.desc}
          </p>
        ))}
      </div>
    </div>
  )
}

export function GestaoCheck() {
  return (
    <section
      id="gestaocheck"
      aria-labelledby="gc-title"
      className="mx-auto max-w-6xl px-6 pt-[16vh] md:px-10"
    >
      <SectionHeading n="03" id="gc-title" title="GestãoCheck" />

      <div className="mt-8 grid gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
        <m.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
            Projeto em destaque · clientes reais
          </p>
          <p className="mt-5 text-lg leading-relaxed text-fg/90">
            ERP modular em formato SaaS para controle de estoque, custos e operação, em uso por
            clientes reais.
          </p>

          <h3 className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-accent">
            O que eu fiz
          </h3>
          <ul className="mt-4 space-y-3">
            {didList.map((t) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed text-muted md:text-base">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-line bg-bg/75 md:bg-bg/55 p-5 md:backdrop-blur-md">
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                Módulos
              </dt>
              <dd className="mt-2 font-display text-5xl font-bold text-accent">
                <Counter to={16} suffix="+" />
              </dd>
            </div>
            <div className="rounded-2xl border border-line bg-bg/75 md:bg-bg/55 p-5 md:backdrop-blur-md">
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                Testes automatizados
              </dt>
              <dd className="mt-2 font-display text-5xl font-bold text-accent">
                <Counter to={189} suffix="+" />
              </dd>
            </div>
          </dl>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Recursos">
            {features.map((f) => (
              <Chip key={f}>{f}</Chip>
            ))}
          </ul>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Stack">
            {stack.map((s) => (
              <Chip key={s} dashed>
                {s}
              </Chip>
            ))}
          </ul>

          <m.a
            href="https://gestaocheck.tech/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg shadow-[0_0_28px_-6px_var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Conhecer o produto →
          </m.a>
        </m.div>

        <ShotViewer />
      </div>
    </section>
  )
}
