import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

interface PageHeaderAction {
  label: string
  to: string
}

interface PageHeaderProps {
  action?: PageHeaderAction
  description?: string
  eyebrow?: string
  title: string
}

function PageHeader({ action, description, eyebrow, title }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        {eyebrow ? (
          <p className="text-sm text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className="font-heading text-3xl font-semibold">{title}</h1>
        {description ? (
          <p className="text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {action ? (
        <Button
          nativeButton={false}
          render={<Link to={action.to} />}
          variant="outline"
        >
          {action.label}
        </Button>
      ) : null}
    </header>
  )
}

export default PageHeader
