// eslint-disable-next-line @typescript-eslint/naming-convention
export const Direction = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
} as const

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Direction = typeof Direction[keyof typeof Direction]

export function vectorToName(vec: Direction): string {
  if (vec.x === Direction.up.x && vec.y === Direction.up.y) {
    return 'up'
  } else if (vec.x === Direction.down.x && vec.y === Direction.down.y) {
    return 'down'
  } else if (vec.x === Direction.left.x && vec.y === Direction.left.y) {
    return 'left'
  } else if (vec.x === Direction.right.x && vec.y === Direction.right.y) {
    return 'right'
  } else {
    return ''
  }
}

export function parse(name: string): Direction {
  switch (name) {
    case 'up':
      return Direction.up
    case 'down':
      return Direction.down
    case 'left':
      return Direction.left
    case 'right':
      return Direction.right
    default:
      console.error('Parseできない文字列', name)
      return Direction.down
  }
}
