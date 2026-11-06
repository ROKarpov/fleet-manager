import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/fleets/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Loading fleets</div>
}
