export { cn } from 'cn'

export const routeFactory = {
  fleets: {
    base: () => ['fleets'] as const,
    all: () => [...routeFactory.fleets.base(), 'list'] as const,
    details: (fleetId: string) =>
      [...routeFactory.fleets.base(), 'item', fleetId] as const,
  },
  robots: {
    base: () => ['robots'] as const,
    all: (fleetId: string) =>
      [...routeFactory.robots.base(), 'list', fleetId] as const,
    details: (robotId: string) =>
      [...routeFactory.robots.base(), 'item', robotId] as const,
  },
  signals: {
    base: () => ['signals'] as const,
    all: (robotId: string) =>
      [...routeFactory.signals.base(), 'list', robotId] as const,
  },
}
