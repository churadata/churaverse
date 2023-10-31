import { CollidableEntityRepository } from './collidableEntityRepository'
import { ICollidableEntity } from './collidableEntity/ICollidableEntity'
import { IRectangle } from './collidableEntity/IRectangle'

interface CollidedDict {
  [id: string]: string[]
}

/**
 * 引数で渡した2つリポジトリ内のオブジェクト同士が重なった際にcallbackが実行される
 * callbackの引数には衝突したオブジェクトとそのidが渡される
 *
 * @param entityRepository1 衝突対象のentityのリポジトリ1
 * @param entityRepository2 衝突対象のentityのリポジトリ2
 * @param onOverlap (entity1のid, entity1, entity2のid, entity2) => void
 */
export function detectEntityOverlap<T1 extends ICollidableEntity, T2 extends ICollidableEntity>(
  entityRepository1: CollidableEntityRepository<T1>,
  entityRepository2: CollidableEntityRepository<T2>,
  onOverlap: (id1: string, entity1: T1, id2: string, entity2: T2) => void // 衝突時に実行するcallback
): void {
  const collidedDict = getCollidedDict(entityRepository1, entityRepository2)

  if (Object.keys(collidedDict).length === 0) return
  for (const entityId1 of Object.keys(collidedDict)) {
    const entity1 = entityRepository1.get(entityId1)
    if (entity1 === undefined) continue
    if (!entity1.isCollidable) continue
    for (const entityId2 of collidedDict[entityId1]) {
      const entity2 = entityRepository2.get(entityId2)
      if (entity2 === undefined) continue
      if (!entity2.isCollidable) continue
      onOverlap(entityId1, entity1, entityId2, entity2)
    }
  }
}

/**
 * 引数に渡した２つの矩形が重なっている場合trueを返す
 */
export function isCollided(rect1: IRectangle, rect2: IRectangle): boolean {
  const horizontal =
    rect2.position.x - rect2.width / 2 < rect1.position.x - rect1.width / 2 + rect1.width &&
    rect1.position.x - rect1.width / 2 < rect2.position.x - rect2.width / 2 + rect2.width
  const vertical =
    rect2.position.y - rect2.height / 2 < rect1.position.y - rect1.height / 2 + rect1.height &&
    rect1.position.y - rect1.height / 2 < rect2.position.y - rect2.height / 2 + rect2.height

  return horizontal && vertical
}

/**
 * entityRepository1の各オブジェクトidをキーとし、そのオブジェクトと衝突しているentityRepository2内のオブジェクトidの配列をバリューとする辞書を返す
 * collidedDict[entityRepository1内のオブジェクトA] = [Aと衝突しているentityRepository2内のオブジェクトB, [Aと衝突しているentityRepository2内のオブジェクトC]
 *
 * @param entityRepository1 衝突判定したいオブジェクト群1のRepository
 * @param entityRepository2 衝突判定したいオブジェクト群2のRepository
 */
export function getCollidedDict<T1 extends ICollidableEntity, T2 extends ICollidableEntity>(
  entityRepository1: CollidableEntityRepository<T1>,
  entityRepository2: CollidableEntityRepository<T2>,
  currentIndex = 0,
  checkStack1: string[] = [],
  checkStack2: string[] = [],
  collidedDict: CollidedDict = {}
): CollidedDict {
  const currentCell1 = entityRepository1.qtreeData[currentIndex]
  const currentCell2 = entityRepository2.qtreeData[currentIndex]

  // 現段階のCollidedDictに同じ空間内で衝突しているオブジェクトを追加
  Object.assign(
    collidedDict,
    hitTestInCell(currentCell1, currentCell2, entityRepository1, entityRepository2, checkStack1, checkStack2)
  )

  // 現在参照している空間の子孫空間にオブジェクトが存在するか
  let hasChildren = false

  // 現在参照している空間の子空間を見ていく
  for (let i = 0; i < 4; i++) {
    const nextIndex = currentIndex * 4 + 1 + i

    // nextIndexが各四分木のサイズを超えている場合true
    const outOfIndex =
      nextIndex >= entityRepository1.qtreeData.length && nextIndex >= entityRepository2.qtreeData.length

    // nextIndexで指定した空間かその子孫空間にオブジェクトが存在しない場合true
    const noChild = entityRepository1.qtreeData[nextIndex] === null && entityRepository2.qtreeData[nextIndex] === null

    const hasChildCell = !outOfIndex && !noChild

    // nextIndexで指定した空間かその子孫空間にオブジェクトが存在して、hasChildrenがfalseの場合はtrueに上書き
    hasChildren = hasChildren || hasChildCell

    if (hasChildCell) {
      if (currentCell1 !== null) {
        checkStack1.push(...currentCell1)
      }
      if (currentCell2 !== null) {
        checkStack2.push(...currentCell2)
      }

      // 現在の空間内オブジェクトを衝突リストにpush、参照する空間を子空間にして再帰
      getCollidedDict(entityRepository1, entityRepository2, nextIndex, checkStack1, checkStack2, collidedDict)

      // 子空間から戻ってきたので現在の空間内オブジェクトを衝突リストからpop
      if (currentCell1 !== null) {
        const popNum1 = currentCell1.size
        checkStack1.splice(-popNum1)
      }
      if (currentCell2 !== null) {
        const popNum2 = currentCell2.size
        checkStack2.splice(-popNum2)
      }
    }
  }
  return collidedDict
}

/**
 * 同じ空間内にあるオブジェクト同士の衝突判定をとる
 * 衝突リストにあるオブジェクトとも衝突判定をとる
 */
export function hitTestInCell<T1 extends ICollidableEntity, T2 extends ICollidableEntity>(
  _cell1: Set<string> | null,
  _cell2: Set<string> | null,
  entityRepository1: CollidableEntityRepository<T1>,
  entityRepository2: CollidableEntityRepository<T2>,
  checkStack1: string[],
  checkStack2: string[]
): CollidedDict {
  if ((_cell1 === null || _cell1.size <= 0) && (_cell2 === null || _cell2.size <= 0)) return {}

  _cell1 ??= new Set()
  _cell2 ??= new Set()
  const collidedDict: CollidedDict = {}
  const cell1 = checkStack1.concat(..._cell1)
  const cell2 = checkStack2.concat(..._cell2)
  for (const id1 of cell1) {
    for (const id2 of cell2) {
      const rectInfo1 = entityRepository1.get(id1)?.getRect()
      const rectInfo2 = entityRepository2.get(id2)?.getRect()
      if (rectInfo1 !== undefined && rectInfo2 !== undefined) {
        if (isCollided(rectInfo1, rectInfo2)) {
          if (id1 in collidedDict) {
            collidedDict[id1].push(id2)
          } else {
            collidedDict[id1] = [id2]
          }
        }
      }
    }
  }

  return collidedDict
}
