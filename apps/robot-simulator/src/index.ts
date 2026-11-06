import cron from 'node-cron'

import { RobotSimulator } from './simulate-robot.ts'
import { testConnection, log } from './log.ts'

const robotId = process.argv[2]
if (!robotId) {
  throw new Error('No robotId specified')
}

const testResult = await testConnection(robotId)
if (!testResult) {
  throw new Error('Cannot establish connection with logger')
}

const robot = new RobotSimulator()

const job = cron.schedule(
  '*/1 * * * * *',
  () => {
    robot.doNextStep()
    log(robotId, robot.currentState)
  },
  { noOverlap: true },
)

process.on('SIGTERM', () => {
  job.stop()
})
