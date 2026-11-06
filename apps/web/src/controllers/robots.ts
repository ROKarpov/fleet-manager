import { prisma } from '#/db'

export function getFleetRobots(fleetId: string) {
  return prisma.robot
    .findMany({
      where: {
        fleetId,
      },
      select: {
        id: true,
        name: true,
        fleetId: true,
        signals: {
          orderBy: {
            receivedAt: 'desc',
          },
          take: 1,
        },
      },
    })
    .then((rawRobots) =>
      rawRobots.map(({ signals, ...robot }) => ({
        ...robot,
        latestSignal: signals[0],
      })),
    )
}

export function getRobot(id: string) {
  return prisma.robot.findUnique({
    where: { id },
  })
}
