import type { Robot } from '#/generated/prisma/browser'
import { routeFactory } from '#/lib/utils'
import { useQuery } from '@tanstack/react-query'

type RobotDetailsProps = {
  robotId: string
}
export function RobotDetails({ robotId }: RobotDetailsProps) {
  const {
    data: robot,
    isFetching,
    isError,
  } = useQuery({
    queryKey: routeFactory.robots.details(robotId),
    queryFn: () =>
      fetch(`/api/robots/${robotId}`).then((response): Promise<Robot> =>
        response.json(),
      ),
  })

  if (isFetching) {
    return 'Loading'
  }

  if (isError) {
    return 'Error loading data'
  }

  return <h2 className="text-lg">{robot?.name}</h2>
}
