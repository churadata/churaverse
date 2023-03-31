export interface Rectangle {
  width: number
  height: number
  x: number
  y: number
}

type RectInfos = Map<string, Rectangle>

interface CollidedDict {
  [id: string]: string[]
}

export function isCollided(rect1: Rectangle, rect2: Rectangle): boolean {
  const horizontal =
    rect2.x - rect2.width / 2 < rect1.x - rect1.width / 2 + rect1.width &&
    rect1.x - rect1.width / 2 < rect2.x - rect2.width / 2 + rect2.width
  const vertical =
    rect2.y - rect2.height / 2 < rect1.y - rect1.height / 2 + rect1.height &&
    rect1.y - rect1.height / 2 < rect2.y - rect2.height / 2 + rect2.height

  return horizontal && vertical
}

// qtree1のオブジェクトidをキーとし、そのオブジェクトと衝突しているqtree2内のオブジェクトidの配列をバリューとする辞書を返す
// collidedDict[qtree1内のオブジェクトA] = [Aと衝突しているqtree2内のオブジェクトB, [Aと衝突しているqtree2内のオブジェクトC]
export function getCollidedDict(
  qtree1: LinearQuadTreeSpace,
  qtree2: LinearQuadTreeSpace,
  rectInfos1: RectInfos,
  rectInfos2: RectInfos,
  currentIndex = 0,
  checkStack1: string[] = [],
  checkStack2: string[] = [],
  collidedDict: CollidedDict = {}
): CollidedDict {
  const currentCell1 = qtree1.data[currentIndex]
  const currentCell2 = qtree2.data[currentIndex]

  Object.assign(
    collidedDict,
    hitTestInCell(
      currentCell1,
      currentCell2,
      rectInfos1,
      rectInfos2,
      checkStack1,
      checkStack2
    )
  )

  let hasChildren = false
  for (let i = 0; i < 4; i++) {
    const nextIndex = currentIndex * 4 + 1 + i

    const outOfIndex =
      nextIndex >= qtree1.data.length && nextIndex >= qtree2.data.length
    const noChild =
      qtree1.data[nextIndex] === null && qtree2.data[nextIndex] === null
    const hasChildCell = !outOfIndex && !noChild
    hasChildren = hasChildren || hasChildCell

    if (hasChildCell) {
      if (currentCell1 !== null) {
        checkStack1.push(...currentCell1)
      }
      if (currentCell2 !== null) {
        checkStack2.push(...currentCell2)
      }

      getCollidedDict(
        qtree1,
        qtree2,
        rectInfos1,
        rectInfos2,
        nextIndex,
        checkStack1,
        checkStack2,
        collidedDict
      )

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

export function hitTestInCell(
  _cell1: Set<string> | null,
  _cell2: Set<string> | null,
  rectInfos1: RectInfos,
  rectInfos2: RectInfos,
  checkStack1: string[],
  checkStack2: string[]
): CollidedDict {
  if (
    (_cell1 === null || _cell1.size <= 0) &&
    (_cell2 === null || _cell2.size <= 0)
  )
    return {}

  _cell1 ??= new Set()
  _cell2 ??= new Set()
  const collidedDict: CollidedDict = {}
  const cell1 = checkStack1.concat(..._cell1)
  const cell2 = checkStack2.concat(..._cell2)
  for (const id1 of cell1) {
    for (const id2 of cell2) {
      const rectInfo1 = rectInfos1.get(id1)
      const rectInfo2 = rectInfos2.get(id2)
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

// 線形四分木空間。
// 空間階層のことをレベル、
// 各小空間のことをセルと呼ぶことにする。
export class LinearQuadTreeSpace {
  public data: Array<Set<string> | null>

  private readonly width: number
  private readonly height: number

  private currentLevel: number

  private readonly linearIndexList = new Map<string, number>()

  constructor(level: number = 3) {
    const WORLD_WIDTH = 40 * 40
    const WORLD_HEIGHT = 50 * 40
    this.width = WORLD_WIDTH
    this.height = WORLD_HEIGHT
    this.data = [null]
    this.currentLevel = 0

    // 入力レベルまでdataを伸長する。
    while (this.currentLevel < level) {
      this.expand()
    }
  }

  // dataをクリアする。
  public clear(): void {
    this.data.fill(null)
  }

  // 要素をdataに追加する。
  // 必要なのは、要素と、レベルと、レベル内での番号。
  private addNode(
    id: string,
    level: number,
    index: number,
    linearIndex?: number
  ): void {
    linearIndex ??= this.mortonNum2LinearIndex(level, index)

    // もしdataの長さが足りないなら拡張する。
    while (this.data.length <= linearIndex) {
      this.expand()
    }

    // セルの初期値はnullとする。
    // しかし上の階層がnullのままだと面倒が発生する。
    // なので要素を追加する前に親やその先祖すべてを
    // 空配列で初期化する。
    let parentCellIndex = linearIndex
    while (this.data[parentCellIndex] === null) {
      this.data[parentCellIndex] = new Set()

      parentCellIndex = Math.floor((parentCellIndex - 1) / 4)
      if (parentCellIndex >= this.data.length || parentCellIndex < 0) {
        break
      }
    }

    // セルに要素を追加する。
    const cell = this.data[linearIndex]
    this.linearIndexList.set(id, linearIndex)
    if (cell !== null) {
      cell.add(id)
    }
  }

  public getLinearIndex(id: string): number | undefined {
    const linearIndexList = this.linearIndexList.get(id)
    if (linearIndexList !== undefined) {
      return linearIndexList
    } else {
      console.log('linearIndexList内に存在しないidが指定されました。')
    }
  }

  private mortonNum2LinearIndex(level: number, index: number): number {
    // オフセットは(4^L - 1)/3で求まる。
    // それにindexを足せば線形四分木上での位置が出る。
    const offset = (4 ** level - 1) / 3
    return offset + index
  }

  public removeActor(id: string): void {
    const linearIndex = this.getLinearIndex(id)
    if (linearIndex === undefined) return
    this.data[linearIndex]?.delete(id)
    this.linearIndexList.delete(id)
    const linearIndexData = this.data[linearIndex]
    if (linearIndexData !== null && linearIndexData.size <= 0) {
      this.changeNullIfNeeded(linearIndex)
    }
  }

  // 子空間が全てnullなら自身をnullに変える
  private changeNullIfNeeded(index: number): void {
    const indexData = this.data[index]
    if (indexData === null || indexData === undefined || indexData.size > 0)
      return
    // 子空間が全てnullなら自分をnullにする
    let noChildren = true
    for (let i = 0; i < 4; i++) {
      const nextIndex = index * 4 + 1 + i

      const outOfIndex = nextIndex >= this.data.length
      const noChild = this.data[nextIndex] === null
      const hasChildCell = !outOfIndex && !noChild
      if (hasChildCell) {
        noChildren = false
        break
      }
    }
    if (noChildren) {
      // 子空間が全てnullなので自分をnullにする
      this.data[index] = null

      const parentCellIndex = Math.floor((index - 1) / 4)
      this.changeNullIfNeeded(parentCellIndex)
    }
  }

  // Actorを線形四分木に追加する。
  // Actorのコリジョンからモートン番号を計算し、
  // 適切なセルに割り当てる。
  public addActor(rect: Rectangle, id: string): void {
    const left = rect.x - rect.width / 2
    const right = rect.x + rect.width / 2
    const top = rect.y - rect.height / 2
    const bottom = rect.y + rect.height / 2

    // モートン番号の計算。
    const leftTopMorton = this.calc2DMortonNumber(left, top)
    const rightBottomMorton = this.calc2DMortonNumber(right, bottom)

    // 左上も右下も-1（画面外）ならば四分木から削除
    if (leftTopMorton === -1 && rightBottomMorton === -1) {
      this.removeActor(id)
      return
    }

    // 左上と右下が同じ番号に所属していたら、
    // それはひとつのセルに収まっているということなので、
    // 特に計算もせずそのまま現在のレベルのセルに入れる。
    if (leftTopMorton === rightBottomMorton) {
      this.addNode(id, this.currentLevel, leftTopMorton)
      return
    }

    // 左上と右下が異なる番号（＝境界をまたいでいる）の場合、
    // 所属するレベルを計算する。
    const level = this.calcLevel(leftTopMorton, rightBottomMorton)

    // そのレベルでの所属する番号を計算する。
    // モートン番号の代表値として大きい方を採用する。
    // これは片方が-1の場合、-1でない方を採用したいため。
    const larger = Math.max(leftTopMorton, rightBottomMorton)
    const cellNumber = this.calcCell(larger, level)

    // 線形四分木に追加する。
    this.addNode(id, level, cellNumber)
  }

  // 線形四分木の長さを伸ばす。
  private expand(): void {
    const nextLevel = this.currentLevel + 1
    const length = (4 ** (nextLevel + 1) - 1) / 3

    while (this.data.length < length) {
      this.data.push(null)
    }

    this.currentLevel++
  }

  // すでに四分木に登録されている要素のモートン番号を更新する
  // 完全にワールド外に出ている場合は四分木から削除、falseを返す
  public updateActor(rect: Rectangle, id: string): boolean {
    const left = rect.x - rect.width / 2
    const right = rect.x + rect.width / 2
    const top = rect.y - rect.height / 2
    const bottom = rect.y + rect.height / 2

    const leftTopMorton = this.calc2DMortonNumber(left, top)
    const rightBottomMorton = this.calc2DMortonNumber(right, bottom)

    if (leftTopMorton === -1 && rightBottomMorton === -1) {
      this.removeActor(id)
      return false
    }

    if (leftTopMorton === rightBottomMorton) {
      this.updateNode(id, this.currentLevel, leftTopMorton)
      return true
    }

    const level = this.calcLevel(leftTopMorton, rightBottomMorton)

    const larger = Math.max(leftTopMorton, rightBottomMorton)
    const cellNumber = this.calcCell(larger, level)

    this.updateNode(id, level, cellNumber)
    return true
  }

  private updateNode(id: string, level: number, index: number): void {
    const linearIndex = this.mortonNum2LinearIndex(level, index)
    // 同じ空間の場合は更新を省略する
    if (linearIndex !== this.getLinearIndex(id)) {
      this.removeActor(id)
      this.addNode(id, level, index)
    }
  }

  // 16bitの数値を1bit飛ばしの32bitにする。
  private separateBit32(n: number): number {
    n = (n | (n << 8)) & 0x00ff00ff
    n = (n | (n << 4)) & 0x0f0f0f0f
    n = (n | (n << 2)) & 0x33333333
    return (n | (n << 1)) & 0x55555555
  }

  // x, y座標からモートン番号を算出する。
  private calc2DMortonNumber(x: number, y: number): number {
    // 空間の外の場合-1を返す。
    if (x < 0 || y < 0) {
      return -1
    }

    if (x > this.width || y > this.height) {
      return -1
    }

    // 空間の中の位置を求める。
    const xCell = Math.floor(x / (this.width / 2 ** this.currentLevel))
    const yCell = Math.floor(y / (this.height / 2 ** this.currentLevel))

    // x位置とy位置をそれぞれ1bit飛ばしの数にし、
    // それらをあわせてひとつの数にする。
    // これがモートン番号となる。
    return this.separateBit32(xCell) | (this.separateBit32(yCell) << 1)
  }

  // オブジェクトの所属レベルを算出する。
  // XORを取った数を2bitずつ右シフトして、
  // 0でない数が捨てられたときのシフト回数を採用する。
  private calcLevel(leftTopMorton: number, rightBottomMorton: number): number {
    const xorMorton = leftTopMorton ^ rightBottomMorton
    let level = this.currentLevel - 1
    let attachedLevel = this.currentLevel

    for (let i = 0; level >= 0; i++) {
      const flag = (xorMorton >> (i * 2)) & 0x3
      if (flag > 0) {
        attachedLevel = level
      }

      level--
    }

    return attachedLevel
  }

  // 階層を求めるときにシフトした数だけ右シフトすれば
  // 空間の位置がわかる。
  private calcCell(morton: number, level: number): number {
    const shift = (this.currentLevel - level) * 2
    return morton >> shift
  }
}
