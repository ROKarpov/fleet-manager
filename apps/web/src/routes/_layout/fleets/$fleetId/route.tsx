import { createFileRoute, Outlet } from '@tanstack/react-router'
import { FleetData } from './-components/fleet-data'
import { RobotTable } from './-components/robots-table'
import { Card, CardContent } from '#/components/ui/card'

export const Route = createFileRoute('/_layout/fleets/$fleetId')({
  component: RouteComponent,
  staticData: {
    title: 'Fleet Overview',
  },
})

function RouteComponent() {
  const { fleetId } = Route.useParams()

  return (
    <div className="m-4 flex flex-col gap-2 overflow-hidden">
      <FleetData fleetId={fleetId} />

      <div className="flex flex-row gap-2 overflow-hidden items-stretch">
        <Card className="flex-3">
          <CardContent className="overflow-scroll">
            <RobotTable fleetId={fleetId} />
          </CardContent>
        </Card>
        <Outlet />
      </div>
    </div>
  )
}
