import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/fleets/$fleetId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return null
}
