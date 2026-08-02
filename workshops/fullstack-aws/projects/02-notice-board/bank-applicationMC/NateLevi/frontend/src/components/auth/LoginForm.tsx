import type { FormEventHandler } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { paths } from '@/routes/paths'

interface LoginFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>
}

function LoginForm({ onSubmit }: LoginFormProps) {
  return (
    <Card className="surface-card border-0 p-2">
      <CardHeader className="items-start text-left">
        <CardTitle>
          <h1 className="font-heading text-3xl">Welcome back</h1>
        </CardTitle>
        <CardDescription className="pl-1">Type in the textbox and click submit to post to the notice board</CardDescription>
      </CardHeader>

      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <CardContent>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="email">Message</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Button className="w-full" size="lg" type="submit">
            Post message to board
          </Button>
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link to={paths.register} />}
            size="lg"
            variant="outline"
          >
            Create profile
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default LoginForm
