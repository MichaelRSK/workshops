import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { RiChat3Line, RiCloseLine, RiRobot2Line, RiSendPlaneLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: number
  role: 'assistant' | 'user'
  text: string
}

const suggestions = ['How do I deposit?', 'Checking or savings?', 'How is my account protected?']
const welcomeMessage: Message = {
  id: 1,
  role: 'assistant',
  text: 'Hi, I’m Dina—your Dinero guide. Ask me how to use your accounts or choose a quick question below.',
}

function answerQuestion(question: string) {
  const text = question.toLowerCase()
  if (text.includes('deposit') || text.includes('add money')) return 'Choose Deposit from Overview, select the exact Checking or Savings account, enter an amount, and submit. Dinero highlights the selected account and confirms a successful deposit.'
  if (text.includes('withdraw') || text.includes('take out')) return 'Choose Withdraw funds, select the account the money should come from, enter an amount, and submit. A withdrawal cannot exceed the selected account’s available balance.'
  if (text.includes('checking') || text.includes('saving')) return 'Checking is designed for frequent money movement. Savings helps separate money intended for a future goal or unexpected expense. Dinero lets you keep and view both.'
  if (text.includes('transaction') || text.includes('activity') || text.includes('history')) return 'Open Activity in the top navigation to see deposits and withdrawals from all your accounts, sorted newest first. Each row includes its account and transaction reference.'
  if (text.includes('password') || text.includes('jwt') || text.includes('secure') || text.includes('protect')) return 'Passwords are hashed by the backend and never stored as plain text. After login, FastAPI issues a signed JWT that is included with protected requests and removed from this tab when you log out.'
  if (text.includes('open') || text.includes('create') || text.includes('new account')) return 'From Overview, select Add account. Choose Checking or Savings, then use the green Open account button. Each profile can have one account of each type.'
  if (text.includes('balance')) return 'Your account cards on Overview display current balances. I do not read or repeat private balance information in chat.'
  if (text.includes('learn') || text.includes('guide') || text.includes('glossary')) return 'Open Learn in the top navigation for six short lessons, a weekly money routine, and a plain-language banking glossary.'
  if (text.includes('hello') || text.includes('hi ') || text === 'hi' || text.includes('hey')) return 'Hi! I can explain how to use Dinero, how account types differ, and how the security flow works.'
  return 'I can help with deposits, withdrawals, account types, balances, transaction history, navigation, and Dinero security. Try asking one of those topics.'
}

function DineroAssistant() {
  const nextMessageId = useRef(2)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([welcomeMessage])

  useEffect(() => {
    function resetConversation() {
      setMessages([welcomeMessage])
      setInput('')
      nextMessageId.current = 2
    }

    window.addEventListener('pageshow', resetConversation)
    return () => window.removeEventListener('pageshow', resetConversation)
  }, [])

  function send(question: string) {
    const cleanQuestion = question.trim()
    if (!cleanQuestion) return
    const id = nextMessageId.current
    nextMessageId.current += 2
    setMessages((current) => [...current, { id, role: 'user', text: cleanQuestion }, { id: id + 1, role: 'assistant', text: answerQuestion(cleanQuestion) }])
    setInput('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    send(input)
  }

  return <>
    {open && <section aria-label="Dina — your Dinero guide" className="assistant-panel" role="dialog">
      <header className="flex items-center justify-between border-b border-emerald-900/10 px-4 py-3"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-emerald-700 text-white"><RiRobot2Line /></span><div><h2 className="font-heading font-semibold">Dina</h2><p className="text-xs text-muted-foreground">Your Dinero guide · no private data</p></div></div><Button aria-label="Close Dina" onClick={() => setOpen(false)} size="icon-sm" variant="ghost"><RiCloseLine /></Button></header>
      <div aria-live="polite" className="assistant-messages"><div className="space-y-3">{messages.map((message) => <p className={`assistant-message ${message.role === 'user' ? 'assistant-message-user' : 'assistant-message-bot'}`} key={message.id}>{message.text}</p>)}</div></div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3">{suggestions.map((suggestion) => <button className="shrink-0 rounded-full border border-emerald-900/15 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-50" key={suggestion} onClick={() => send(suggestion)} type="button">{suggestion}</button>)}</div>
      <form className="flex gap-2 border-t border-emerald-900/10 p-3" onSubmit={handleSubmit}><Input aria-label="Ask Dina" autoComplete="off" onChange={(event) => setInput(event.target.value)} placeholder="Ask Dina a question…" value={input} /><Button aria-label="Send question" disabled={!input.trim()} size="icon" type="submit"><RiSendPlaneLine /></Button></form>
    </section>}
    <button aria-expanded={open} aria-label={open ? 'Close Dina' : 'Open Dina — your Dinero guide'} className="assistant-launcher" onClick={() => setOpen((current) => !current)} type="button">{open ? <RiCloseLine /> : <RiChat3Line />}<span className="hidden sm:inline">{open ? 'Close' : 'Ask Dina'}</span></button>
  </>
}

export default DineroAssistant
