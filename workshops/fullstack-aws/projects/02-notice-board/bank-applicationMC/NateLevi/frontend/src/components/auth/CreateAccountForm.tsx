import type { FormEventHandler } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { paths } from '@/routes/paths'

function CreateAccountForm({ onSubmit }: { onSubmit: FormEventHandler<HTMLFormElement> }) {
  return (
    <Card className="surface-card border-0 p-2">
      <CardHeader><CardTitle><h1 className="font-heading text-3xl">Create your profile</h1></CardTitle></CardHeader>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <CardContent><FieldGroup className="gap-4">
          <Field><FieldLabel htmlFor="name">Full name</FieldLabel><Input id="name" name="name" autoComplete="name" required /></Field>
          <Field><FieldLabel htmlFor="email">Email address</FieldLabel><Input id="email" name="email" type="email" autoComplete="email" required /></Field>
          <Field><FieldLabel htmlFor="password">Password</FieldLabel><Input id="password" name="password" type="password" autoComplete="new-password" minLength={12} required /><p className="text-xs text-muted-foreground">Use at least 12 characters. “123456” needs to be retired.</p></Field>
        </FieldGroup></CardContent>
        <CardFooter className="flex-col gap-3"><Button className="w-full" size="lg" type="submit">Create secure profile</Button><Button className="w-full" nativeButton={false} render={<Link to={paths.login} />} size="lg" variant="outline">Back to sign in</Button></CardFooter>
      </form>
    </Card>
  )
}

export default CreateAccountForm
