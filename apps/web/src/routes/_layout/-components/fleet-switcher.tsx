import { ChevronsUpDown, RobotArm } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import { routeFactory } from '#/lib/utils'
import { useEffect } from 'react'
import { Skeleton } from '../../../components/ui/skeleton'
import { useMatches, useNavigate } from '@tanstack/react-router'
import type { Fleet } from '#/generated/prisma/browser'

function getValidFleetId(
  fleets: Fleet[] | undefined,
  fleetId: string | undefined,
): string | undefined {
  if (!(fleets && fleets.length)) {
    return undefined
  }

  if (!fleetId) {
    return fleets[0].id
  }
  const fleet = fleets.find(({ id }) => id === fleetId)
  return fleet?.id ?? fleets[0].id
}

function getFleetIdFromMatchParams(matches: ReturnType<typeof useMatches>) {
  const lastMatchParams = matches.at(-1)?.params

  return lastMatchParams && 'fleetId' in lastMatchParams
    ? lastMatchParams.fleetId
    : undefined
}

export function FleetSwitcher() {
  const { data: fleets, isFetching } = useQuery({
    queryKey: routeFactory.fleets.all(),
    queryFn: () =>
      fetch('/api/fleets').then((response): Promise<Fleet[]> =>
        response.json(),
      ),
    initialData: [],
  })

  const { isMobile } = useSidebar()
  const matches = useMatches()
  const fleetId = getFleetIdFromMatchParams(matches)

  const navigate = useNavigate()

  useEffect(() => {
    const newFleetId = getValidFleetId(fleets, fleetId)
    if (newFleetId && newFleetId !== fleetId) {
      navigate({
        to: '/fleets/$fleetId',
        params: { fleetId: newFleetId },
      })
    }
  }, [fleets, fleetId, navigate])

  if (isFetching) {
    return <Skeleton className="h-12" />
  }

  const activeFleet = fleets.find(({ id }) => id === fleetId)

  if (!activeFleet) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            render={(props) => (
              <SidebarMenuButton {...props} size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <RobotArm className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeFleet.name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            )}
          />
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            {fleets.map((fleet) => (
              <DropdownMenuItem
                key={fleet.name}
                onClick={() =>
                  navigate({
                    to: '/fleets/$fleetId',
                    params: { fleetId: fleet.id },
                  })
                }
                className="gap-2 p-2"
              >
                {fleet.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
