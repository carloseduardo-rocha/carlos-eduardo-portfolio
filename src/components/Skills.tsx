import { useState } from 'react'
import * as m from 'motion/react-m'

type Skill = { name: string; note?: string }

const groups: { id: string; title: string; level: 1 | 2 | 3; hint: string; skills: Skill[] }[] = [
  {
    id: 'dia',
    title: 'Uso no dia a dia',
    level: 3,
    hint: 'Passe o mouse ou toque em uma tecnologia para ver onde eu uso.',
    skills: [
      { name: 'Python', note: 'GestãoCheck (o back-end inteiro) e o agente de IA de Service Desk.' },
      { name: 'Flask', note: 'API e regras de negócio do GestãoCheck, com PostgreSQL por trás.' },
      { name: 'PostgreSQL', note: 'GestãoCheck (um banco isolado por cliente) e a API de e-commerce com Spring Boot.' },
      { name: 'Java', note: 'Chess System, API REST com Spring Boot e o Gerenciador de Contatos da faculdade.' },
      { name: 'Spring Boot', note: 'API REST de e-commerce com JPA/Hibernate, em camadas e com tratamento global de exceções.' },
      { name: 'Git', note: 'Todos os projetos, do GestãoCheck a este portfólio.' },
      { name: 'Docker', note: 'Deploy do GestãoCheck e a base de todo projeto que eu criar para clientes.' },
      { name: 'HTML/CSS', note: 'Este portfólio, o site da Engrenagem Tech e as demos de clientes fictícios.' },
      { name: 'JavaScript', note: 'O portfólio anterior e a base de tudo que faço no front-end.' },
      { name: 'TypeScript', note: 'Este portfólio e o site da Engrenagem Tech, com tipagem estrita.' },
      { name: 'React', note: 'Este portfólio, o site da Engrenagem Tech e as demos de clientes fictícios.' },
    ],
  },
  {
    id: 'projeto',
    title: 'Já usei em projeto',
    level: 2,
    hint: 'Já usei em projetos e vão voltar nos próximos: o FitTribe está sendo retomado.',
    skills: [
      { name: 'Node.js', note: 'Back-end do FitTribe, app que vou retomar e evoluir.' },
      { name: 'React Native', note: 'App do FitTribe, com Expo. Volta a ser desenvolvido.' },
      { name: 'MySQL' },
      { name: 'SQLite', note: 'Banco local do FitTribe.' },
      { name: 'Figma', note: 'Telas do FitTribe e protótipos antes de codar.' },
      { name: 'n8n', note: 'Curso de automação com fluxos, webhooks e IA.' },
      { name: 'Linux' },
    ],
  },
  {
    id: 'estudando',
    title: 'Estudando',
    level: 1,
    hint: 'Em estudo agora.',
    skills: [{ name: 'MongoDB', note: 'Em estudo no momento.' }],
  },
]

function Dots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span aria-hidden="true" className="flex gap-1">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`size-1.5 rounded-full ${n <= level ? 'bg-accent shadow-[0_0_6px_var(--color-accent)]' : 'bg-line'}`}
        />
      ))}
    </span>
  )
}

function Group({ g, i }: { g: (typeof groups)[number]; i: number }) {
  const [note, setNote] = useState<string | null>(null)
  return (
    <m.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-line bg-bg/75 md:bg-bg/55 p-5 md:backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{g.title}</h4>
        <Dots level={g.level} />
      </div>
      <ul className="-mx-1 mt-3 flex flex-wrap">
        {g.skills.map((s) => (
          <li key={s.name}>
            <button
              type="button"
              onMouseEnter={() => setNote(s.note ?? null)}
              onMouseLeave={() => setNote(null)}
              onFocus={() => setNote(s.note ?? null)}
              onBlur={() => setNote(null)}
              onClick={() => setNote(s.note ?? null)}
              className="group cursor-pointer rounded-full p-1 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent"
            >
              {/* the visual lift lives on the inner span, so the clickable area never moves under the pointer */}
              <span className="block rounded-full border border-line bg-bg/40 px-3 py-1.5 text-sm text-fg transition-[border-color,transform,box-shadow] group-hover:-translate-y-0.5 group-hover:border-accent group-hover:shadow-[0_6px_20px_-8px_var(--color-accent)] group-focus-visible:border-accent">
                {s.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 min-h-[5.5rem] text-sm leading-relaxed text-muted" aria-live="polite">
        {note ?? g.hint}
      </p>
    </m.li>
  )
}

export function Skills() {
  return (
    <div className="mt-20">
      <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Tecnologias</h3>
      <ul className="mt-5 grid gap-4 md:grid-cols-[1.5fr_1fr_0.7fr]">
        {groups.map((g, i) => (
          <Group key={g.id} g={g} i={i} />
        ))}
      </ul>
    </div>
  )
}
