import { RiBankLine, RiExchangeDollarLine, RiLock2Line, RiShieldCheckLine, RiSparkling2Line } from '@remixicon/react'

const lessons = [
  {
    eyebrow: 'Accounts 101', title: 'Checking vs. Savings', icon: RiBankLine,
    summary: 'Give everyday money and future money different jobs',
    body: 'Checking accounts are built for frequent money movement. Savings accounts help separate money intended for a future goal or unexpected expense. Keeping those purposes distinct can make a balance easier to understand.',
    points: ['Use checking for regular deposits and withdrawals', 'Use savings to separate money from everyday activity', 'Review both balances before moving money'],
    takeaway: 'Choose the account based on what the money needs to do next.',
  },
  {
    eyebrow: 'Cash flow', title: 'Read your transaction story', icon: RiExchangeDollarLine,
    summary: 'A balance shows where you are; activity explains how you arrived',
    body: 'A transaction history is a timeline of deposits and withdrawals. Looking at it regularly can reveal patterns, confirm that a transaction reached the correct account, and help identify activity you do not recognize.',
    points: ['Match each transaction to the correct account', 'Compare deposits and withdrawals over time', 'Use transaction IDs when discussing a specific record'],
    takeaway: 'Review activity weekly instead of waiting until a balance looks surprising.',
  },
  {
    eyebrow: 'Planning', title: 'Build a simple spending plan', icon: RiSparkling2Line,
    summary: 'Decide where money should go before it quietly goes elsewhere',
    body: 'A practical spending plan starts with money coming in, subtracts essential obligations, assigns a portion to savings, and leaves a realistic amount for flexible spending. The goal is awareness—not a perfect month.',
    points: ['Start with income you can reasonably expect', 'Separate needs, goals, and flexible spending', 'Adjust the plan when real activity differs from it'],
    takeaway: 'Give every portion of your money a purpose, while leaving room for change.',
  },
  {
    eyebrow: 'Preparedness', title: 'Start an emergency cushion', icon: RiShieldCheckLine,
    summary: 'Small, consistent deposits can create useful breathing room',
    body: 'An emergency fund is money reserved for unplanned, necessary costs. The right target depends on the person, but building the habit can begin with a small and repeatable deposit into a separate savings account.',
    points: ['Begin with a reachable first milestone', 'Keep emergency money separate from routine spending', 'Replenish it after using it'],
    takeaway: 'Consistency matters more than starting with a large amount.',
  },
  {
    eyebrow: 'Accuracy', title: 'Move money with intention', icon: RiExchangeDollarLine,
    summary: 'Confirm the account, amount, and resulting balance every time',
    body: 'Before submitting a deposit or withdrawal, verify the selected account and amount. Afterward, confirm the success message, updated balance, and transaction record. These checks reduce avoidable account mistakes.',
    points: ['Check whether Checking or Savings is highlighted', 'Read the amount once more before submitting', 'Confirm the new record in Activity'],
    takeaway: 'Pause, confirm, submit, and verify—the four-step transfer habit.',
  },
  {
    eyebrow: 'Digital safety', title: 'Protect your banking session', icon: RiLock2Line,
    summary: 'Strong credentials and careful sessions are part of financial health',
    body: 'Use a unique password, avoid sharing access tokens, and log out on shared devices. Dinero sends a signed JWT with protected requests, while FastAPI validates identity and account ownership on the server.',
    points: ['Use a unique password with at least 12 characters', 'Never send a token or password in chat', 'Log out when using a shared computer'],
    takeaway: 'Security works best when the application and account holder both do their part.',
  },
] as const

const glossary = [
  ['Account ID', 'A unique number used by the system to identify one account.'],
  ['Available balance', 'The money currently recorded in an account and available for withdrawal.'],
  ['Account type', 'The purpose category of an account, such as Checking or Savings.'],
  ['Deposit', 'Money added to an account.'],
  ['Withdrawal', 'Money removed from an account.'],
  ['Insufficient funds', 'The account does not have enough available balance for the requested withdrawal.'],
  ['Transaction ID', 'A unique reference used to identify one money movement.'],
  ['Password hash', 'A one-way protected representation used to verify a password without storing the original password.'],
  ['JWT', 'A signed token the API uses to verify an authenticated session.'],
] as const

const routine = [
  ['01', 'Review', 'Check balances across Checking and Savings'],
  ['02', 'Recognize', 'Match recent activity to actions you remember'],
  ['03', 'Respond', 'Move money intentionally when a balance needs attention'],
  ['04', 'Repeat', 'Make the review a short, regular habit'],
] as const

function LearnPage() {
  return <main className="page-reveal mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-5 py-10 lg:px-8">
    <header className="grid items-center gap-8 lg:grid-cols-[1.3fr_.7fr]"><div className="max-w-3xl"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-emerald-800"><RiSparkling2Line className="size-4" /> Dinero money guide</p><h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Beyond the Numbers</h1><p className="mt-4 text-lg leading-relaxed text-muted-foreground">Practical explanations that connect directly to your accounts, balances, and activity</p></div><div aria-hidden="true" className="learn-visual"><span className="learn-orbit learn-orbit-one" /><span className="learn-orbit learn-orbit-two" /><span className="learn-orbit learn-orbit-three" /><div className="learn-bank"><RiBankLine /></div></div></header>

    <section><div className="mb-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-800">Six essentials</p><h2 className="mt-1 font-heading text-3xl font-semibold">Learn in about a minute</h2></div><div className="grid gap-5 lg:grid-cols-3" aria-label="Financial learning modules">{lessons.map((lesson, index) => { const Icon = lesson.icon; return <article className="learn-card surface-card rounded-[1.7rem] p-6" key={lesson.title} style={{ animationDelay: `${index * 90}ms` }}><div className="learn-icon grid size-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><Icon /></div><p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-emerald-800">{lesson.eyebrow}</p><h3 className="mt-2 font-heading text-2xl font-semibold">{lesson.title}</h3><p className="mt-2 min-h-12 text-sm font-medium leading-relaxed text-foreground/70">{lesson.summary}</p><details className="group mt-6 border-t border-emerald-900/10 pt-4"><summary className="cursor-pointer list-none font-semibold text-emerald-800">Open lesson <span className="ml-1 inline-block transition group-open:rotate-45">+</span></summary><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{lesson.body}</p><ul className="mt-4 space-y-2">{lesson.points.map((point) => <li className="flex gap-2 text-sm text-foreground/80" key={point}><span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-600" />{point}</li>)}</ul><div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm"><b>Key takeaway:</b> {lesson.takeaway}</div></details></article> })}</div></section>

    <section className="rounded-[1.8rem] bg-[#164e40] p-6 text-white shadow-xl sm:p-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-200">A four-step money routine</p><h2 className="mt-2 font-heading text-3xl font-semibold">Ten useful minutes each week</h2><div className="mt-7 grid gap-4 md:grid-cols-4">{routine.map(([number, title, description]) => <article className="rounded-2xl border border-white/10 bg-white/7 p-4" key={number}><span className="font-heading text-2xl font-bold text-emerald-300">{number}</span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-emerald-50/65">{description}</p></article>)}</div></section>

    <section className="surface-card rounded-[1.7rem] p-6 sm:p-8"><div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-800">Plain-language glossary</p><h2 className="mt-2 font-heading text-3xl font-semibold">Bank words, minus the fog</h2><img alt="A magnifying glass bringing common banking concepts into focus" className="mt-6 aspect-[4/5] w-full rounded-2xl object-cover shadow-lg" loading="lazy" src="/assets/dinero-glossary.png" /></div><dl className="divide-y divide-emerald-900/10">{glossary.map(([term, definition]) => <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4" key={term}><dt className="font-semibold">{term}</dt><dd className="text-sm leading-relaxed text-muted-foreground">{definition}</dd></div>)}</dl></div></section>
  </main>
}

export default LearnPage
