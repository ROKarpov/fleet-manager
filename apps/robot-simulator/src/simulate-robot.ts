const MIN_ROUTE_X = 100
const MAX_ROUTE_X = 500
const MIN_ROUTE_Y = 100
const MAX_ROUTE_Y = 500
const STEP = 25
const MOVE_BATTERY_STEP = 0.01

const CHARGE_THRESHOLD = 0.25
const CHARGE_BATTERY_STEP = 0.1
const MAX_BATTERY_LEVEL = 1

const EPS = 0.0001

const CHARGER_LOCATION = { x: 0, y: 0 } as const
const ROBOT_PATH = [
  { x: MIN_ROUTE_X, y: MIN_ROUTE_Y },
  { x: MAX_ROUTE_X, y: MIN_ROUTE_Y },
  { x: MAX_ROUTE_X, y: MAX_ROUTE_Y },
  { x: MIN_ROUTE_X, y: MAX_ROUTE_Y },
] as const

type RobotStatusSerialized = keyof typeof RobotStatus
type Coordinates = {
  x: number
  y: number
}
type RobotState = {
  position: Coordinates
  targetPosition: Coordinates
  targetPositionIndex: number
  battery: number
  status: RobotStatusSerialized
}

const INITIAL_STATE: RobotState = {
  position: { x: 0, y: 0 },
  battery: 1,
  status: 'CHARGING',
  targetPosition: ROBOT_PATH[0],
  targetPositionIndex: 0,
}

function getAxisSqrDistance(a: Coordinates, b: Coordinates) {
  const sqrDistanceX = (a.x - b.x) * (a.x - b.x)
  const sqrDistanceY = (a.y - b.y) * (a.y - b.y)
  return { x: sqrDistanceX, y: sqrDistanceY }
}

function isTargetReached(state: RobotState) {
  const sqrDistance = getAxisSqrDistance(state.position, state.targetPosition)
  return sqrDistance.x + sqrDistance.y < EPS
}

interface IRobotStatus {
  doNextStep(robot: RobotSimulator): void
}

class DoingWorkRobotStatus implements IRobotStatus {
  doNextStep(robot: RobotSimulator): void {
    if (isTargetReached(robot.currentState)) {
      robot.currentState = this.onTargetReached(robot.currentState)
    }
    robot.move()
    if (robot.currentState.battery < CHARGE_THRESHOLD) {
      robot.currentState = {
        ...robot.currentState,
        status: 'GOING_TO_DOCK',
        targetPosition: CHARGER_LOCATION,
        targetPositionIndex: -1,
      }
    }
  }
  onTargetReached(state: RobotState): RobotState {
    const nextIndex = (state.targetPositionIndex + 1) % ROBOT_PATH.length
    return {
      ...state,
      targetPosition: ROBOT_PATH[nextIndex],
      targetPositionIndex: nextIndex,
    }
  }
}

class GoingToDockRobotStatus implements IRobotStatus {
  doNextStep(robot: RobotSimulator): void {
    if (isTargetReached(robot.currentState)) {
      robot.currentState = this.onTargetReached(robot.currentState)
    } else {
      robot.move()
    }
  }
  onTargetReached(state: RobotState): RobotState {
    return {
      ...state,
      status: 'CHARGING',
      targetPosition: ROBOT_PATH[0],
      targetPositionIndex: 0,
    }
  }
}

class ChargingRobotStatus implements IRobotStatus {
  doNextStep(robot: RobotSimulator): void {
    const nextBatteryLevel = Math.min(
      robot.currentState.battery + CHARGE_BATTERY_STEP,
      MAX_BATTERY_LEVEL,
    )
    const isCharged =
      (nextBatteryLevel - MAX_BATTERY_LEVEL) *
        (nextBatteryLevel - MAX_BATTERY_LEVEL) <
      EPS
    robot.currentState = {
      ...robot.currentState,
      battery: nextBatteryLevel,
      status: isCharged ? 'DOING_WORK' : 'CHARGING',
    }
  }
}

const RobotStatus = {
  DOING_WORK: new DoingWorkRobotStatus(),
  GOING_TO_DOCK: new GoingToDockRobotStatus(),
  CHARGING: new ChargingRobotStatus(),
}

export class RobotSimulator {
  currentState: RobotState = { ...INITIAL_STATE }

  doNextStep() {
    RobotStatus[this.currentState.status].doNextStep(this);
  }

  move() {
    const sqrDistance = getAxisSqrDistance(
      this.currentState.position,
      this.currentState.targetPosition,
    )

    if (sqrDistance.x > sqrDistance.y) {
      this.currentState = {
        ...this.currentState,
        position: {
          x:
            this.currentState.position.x +
            STEP *
              (this.currentState.position.x > this.currentState.targetPosition.x
                ? -1
                : 1),
          y: this.currentState.position.y,
        },
        battery: this.currentState.battery - MOVE_BATTERY_STEP,
      }
    } else {
      this.currentState = {
        ...this.currentState,
        position: {
          x: this.currentState.position.x,
          y:
            this.currentState.position.y +
            STEP *
              (this.currentState.position.y > this.currentState.targetPosition.y
                ? -1
                : 1),
        },
        battery: this.currentState.battery - MOVE_BATTERY_STEP,
      }
    }
  }
}
