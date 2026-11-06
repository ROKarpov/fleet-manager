import type { Fleet } from '#/generated/prisma/browser'
import { routeFactory } from '#/lib/utils'
import { useQuery } from '@tanstack/react-query'

type FleetDataProps = {
  fleetId: string
}

export function FleetData({ fleetId }: FleetDataProps) {
  const {
    data: fleet,
    isFetching,
    isError,
  } = useQuery({
    queryKey: routeFactory.fleets.details(fleetId),
    queryFn: () =>
      fetch(`/api/fleets/${fleetId}`).then((response): Promise<Fleet> =>
        response.json(),
      ),
  })

  if (isFetching) {
    return 'Loading'
  }

  if (isError) {
    return 'Error loading data'
  }

  return <h1 className="text-2xl">{fleet?.name}</h1>
}
