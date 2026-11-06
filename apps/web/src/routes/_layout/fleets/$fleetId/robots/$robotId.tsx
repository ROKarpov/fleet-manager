import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { RobotDetails } from './-components/robot-details'
import { RobotSignalsTable } from './-components/robot-signals-table'

export const Route = createFileRoute(
  '/_layout/fleets/$fleetId/robots/$robotId',
)({
  staticData: {
    title: "Robot Details"
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { fleetId, robotId } = Route.useParams()
  const navigate = useNavigate()

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>
          <RobotDetails robotId={robotId} />
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              navigate({ to: '/fleets/$fleetId', params: { fleetId } })
            }
          >
            <X className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <RobotSignalsTable robotId={robotId} />
      </CardContent>
    </Card>
  )
}
