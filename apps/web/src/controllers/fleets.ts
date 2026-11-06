import { prisma } from '#/db'

export function getFleets() {
  return prisma.fleet.findMany({})
}

export function getFleet(fleetId: string) {
  return prisma.fleet.findUnique({
    where: {
      id: fleetId,
    },
  })
}
