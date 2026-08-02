import { Link } from 'react-router'
import { RiArrowDownLine, RiArrowUpLine, RiInbox2Line } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { BankTransaction } from '@/types/bank'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

interface Props { action?: { label: string; to: string }; description: string; title: string; transactions: BankTransaction[] }

function TransactionTable({ action, description, title, transactions }: Props) {
  return (
    <Card className="surface-card overflow-hidden border-0">
      <CardHeader><CardTitle><h2 className="font-heading text-xl">{title}</h2></CardTitle><CardDescription>{description}</CardDescription>{action && <CardAction><Button nativeButton={false} render={<Link to={action.to} />} size="sm" variant="outline">{action.label}</Button></CardAction>}</CardHeader>
      <CardContent className="px-0 sm:px-6">
        <Table><TableHeader><TableRow><TableHead>Movement</TableHead><TableHead className="hidden sm:table-cell">Account</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="hidden text-right md:table-cell">Date</TableHead></TableRow></TableHeader>
          <TableBody>{transactions.length ? transactions.map((transaction) => {
            const deposit = transaction.type === 'DEPOSIT'
            return <TableRow key={transaction.transactionId}><TableCell><div className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-xl ${deposit ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{deposit ? <RiArrowDownLine /> : <RiArrowUpLine />}</span><div><p className="font-medium">{deposit ? 'Deposit' : 'Withdrawal'}</p><p className="text-xs text-muted-foreground md:hidden">Account •••• {String(transaction.accountId).slice(-4).padStart(4, '0')} · {transaction.date ? date.format(new Date(transaction.date)) : 'Recently'}</p></div></div></TableCell><TableCell className="hidden text-sm text-muted-foreground sm:table-cell"><span className="block font-medium text-foreground">•••• {String(transaction.accountId).slice(-4).padStart(4, '0')}</span><span className="font-mono text-[11px]">TXN-{transaction.transactionId}</span></TableCell><TableCell className={`text-right font-semibold ${deposit ? 'text-emerald-700' : 'text-foreground'}`}>{deposit ? '+' : '−'}{money.format(transaction.amount)}</TableCell><TableCell className="hidden text-right text-muted-foreground md:table-cell">{transaction.date ? date.format(new Date(transaction.date)) : 'Recently'}</TableCell></TableRow>
          }) : <TableRow><TableCell className="h-40 text-center" colSpan={4}><RiInbox2Line className="mx-auto mb-2 size-7 text-emerald-700" /><p className="font-medium">Your activity will appear here</p><p className="text-sm text-muted-foreground">Make a first deposit to get started.</p></TableCell></TableRow>}</TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default TransactionTable
