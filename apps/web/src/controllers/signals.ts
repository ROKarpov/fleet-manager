import { prisma } from '#/db'

type RecordSignalArgs = {
  robotId: string
  metrics: object
}
export function recordSignal(args: RecordSignalArgs) {
  return prisma.robotSignal.create({
    data: {
      ...args,
      receivedAt: new Date(),
    },
  })
}

export function getRobotSignals(robotId: string) {
  return prisma.robotSignal.findMany({
    where: { robotId },
    orderBy: {
      receivedAt: 'desc',
    },
  })
}
