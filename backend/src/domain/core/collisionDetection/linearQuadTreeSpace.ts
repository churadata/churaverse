import { WorldMap } from '../../model/worldMap'
import { IRectangle } from './collidableEntity/IRectangle'

// 空間階層のことをレベル、
// 各小空間のことをセルと呼ぶことにする

/**
 * 線形四分木空間.
 * ワールドを再帰的に縦横半分に分割した空間.
 * セル内に存在するエンティティのidをdataに保持する
 */
export class LinearQuadTreeSpace {
  // data[0]: 親空間
  // data[1]~data[4] : 子空間
  // data[5]~data[8] : 孫空間（data[1]の子空間）
  // data[9]~data[12]: 孫空間（data[2]の子空間）
  public data: Array<Set<string> | null>

  private readonly width: number
  private readonly height: number

  // 現在の四分木空間の最大レベル expand()するたびに+1
  private maxLevel: number

  private readonly linearIndexList = new Map<string, number>()

  public constructor(worldMap: WorldMap, level = 3) {
    const WORLD_WIDTH = worldMap.width
    const WORLD_HEIGHT = worldMap.height
    this.width = WORLD_WIDTH
    this.height = WORLD_HEIGHT
    this.data = [null]
    this.maxLevel = 0

    // 入力レベルまでdataを伸長する
    while (this.maxLevel < level) {
      this.expand()
    }
  }

  /**
   * エンティティのidを線形四分木空間に追加する
   */
  private addNode(id: string, level: number, index: number): void {
    const linearIndex = this.calcLinearIndex(level, index)

    // もしdataの長さが足りないなら拡張
    while (this.data.length <= linearIndex) {
      this.expand()
    }

    // セルの初期値はnull
    // その空間自体はエンティティを持たないが子孫空間がエンティティを持つ場合は空のSetになる

    // エンティティを追加する前に親やその先祖を空のSetで初期化
    let parentCellIndex = linearIndex
    while (this.data[parentCellIndex] === null) {
      this.data[parentCellIndex] = new Set()

      parentCellIndex = Math.floor((parentCellIndex - 1) / 4)
      if (parentCellIndex >= this.data.length || parentCellIndex < 0) {
        break
      }
    }

    // セルにエンティティを追加する
    const cell = this.data[linearIndex]
    this.linearIndexList.set(id, linearIndex)
    if (cell !== null) {
      cell.add(id)
    }
  }

  /**
   * 引数で指定したidが存在するセル番号を返す
   * 四分木空間に存在しないidの場合はundefinedを返す
   */
  public getLinearIndex(id: string): number | undefined {
    const linearIndexList = this.linearIndexList.get(id)
    if (linearIndexList !== undefined) {
      return linearIndexList
    } else {
      console.log('linearIndexList内に存在しないidが指定されました')
    }
  }

  /**
   * レベルとセル番号から線形四分木内のindexを算出する
   */
  private calcLinearIndex(level: number, index: number): number {
    // オフセットは(4^L - 1)/3で求まる
    // それにindexを足せば線形四分木上での位置が出る
    const offset = (4 ** level - 1) / 3
    return offset + index
  }

  /**
   * 指定したidを四分木から削除
   * 四分木内に存在しないidを指定した場合は何もしない
   */
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

  /**
   * 子空間が全てnullなら自身をnullに変える
   */
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

  /**
   * 引数で受け取ったidを線形四分木に追加する
   * 受け取った矩形情報からモートン番号を計算し、適切なセルに割り当てる
   */
  public addActor(id: string, rect: IRectangle): void {
    const left = rect.position.x - rect.width / 2
    const right = rect.position.x + rect.width / 2
    const top = rect.position.y - rect.height / 2
    const bottom = rect.position.y + rect.height / 2

    // モートン番号の計算
    const leftTopMorton = this.calc2DMortonNumber(left, top)
    const rightBottomMorton = this.calc2DMortonNumber(right, bottom)

    // 左上も右下も-1（画面外）ならば四分木から削除
    if (leftTopMorton === -1 && rightBottomMorton === -1) {
      this.removeActor(id)
      return
    }

    // 左上と右下が同じ番号に所属していたら、
    // それはひとつのセルに収まっているということなので、
    // 特に計算もせずそのまま現在のレベルのセルに入れる
    if (leftTopMorton === rightBottomMorton) {
      this.addNode(id, this.maxLevel, leftTopMorton)
      return
    }

    // 左上と右下が異なる番号（＝境界をまたいでいる）の場合、
    // 所属するレベルを計算する
    const level = this.calcLevel(leftTopMorton, rightBottomMorton)

    // そのレベルでの所属する番号を計算する
    // モートン番号の代表値として大きい方を採用する
    // これは片方が-1の場合、-1でない方を採用したいため
    const larger = Math.max(leftTopMorton, rightBottomMorton)
    const cellNumber = this.calcCell(larger, level)

    // セルに追加する
    this.addNode(id, level, cellNumber)
  }

  /**
   * 線形四分木の長さを伸ばす
   */
  private expand(): void {
    const nextLevel = this.maxLevel + 1
    const length = (4 ** (nextLevel + 1) - 1) / 3

    while (this.data.length < length) {
      this.data.push(null)
    }

    this.maxLevel++
  }

  /**
   * すでに四分木に登録されているエンティティが所属するセルを更新する
   * 完全にワールド外に出ている場合は四分木から削除、falseを返す
   */
  public updateActor(id: string, rect: IRectangle): boolean {
    const left = rect.position.x - rect.width / 2
    const right = rect.position.x + rect.width / 2
    const top = rect.position.y - rect.height / 2
    const bottom = rect.position.y + rect.height / 2

    const leftTopMorton = this.calc2DMortonNumber(left, top)
    const rightBottomMorton = this.calc2DMortonNumber(right, bottom)

    // ワールド外に出ている場合は四分木から削除
    if (leftTopMorton === -1 && rightBottomMorton === -1) {
      this.removeActor(id)
      return false
    }

    // ひとつのセル内に収まっている場合、現在のレベルのセルに入れる
    if (leftTopMorton === rightBottomMorton) {
      this.updateNode(id, this.maxLevel, leftTopMorton)
      return true
    }

    // 左上と右下が異なる番号（＝境界をまたいでいる）の場合、
    // 所属するレベルを計算する
    const level = this.calcLevel(leftTopMorton, rightBottomMorton)

    const larger = Math.max(leftTopMorton, rightBottomMorton)
    const cellNumber = this.calcCell(larger, level)

    this.updateNode(id, level, cellNumber)
    return true
  }

  /**
   * すでに四分木に登録されているエンティティが所属するセルを実際に更新する
   * 更新前と更新後が同じ空間の場合は更新を省略する
   * @param id 更新対象のid
   * @param level 対象の所属するレベル
   * @param index 所属レベル内でのセル番号
   */
  private updateNode(id: string, level: number, index: number): void {
    const linearIndex = this.calcLinearIndex(level, index)
    if (linearIndex !== this.getLinearIndex(id)) {
      this.removeActor(id)
      this.addNode(id, level, index)
    }
  }

  /**
   * 16bitの数値を1bit飛ばしの32bitにする
   */
  private separateBit32(n: number): number {
    n = (n | (n << 8)) & 0x00ff00ff
    n = (n | (n << 4)) & 0x0f0f0f0f
    n = (n | (n << 2)) & 0x33333333
    return (n | (n << 1)) & 0x55555555
  }

  /**
   * x, y座標からモートン番号を算出する
   * 空間外の場合-1を返す
   */
  private calc2DMortonNumber(x: number, y: number): number {
    // 空間外の場合
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
      return -1
    }

    // 空間の中の位置を求める
    const xCell = Math.floor(x / (this.width / 2 ** this.maxLevel))
    const yCell = Math.floor(y / (this.height / 2 ** this.maxLevel))

    // モートン番号の算出
    return this.separateBit32(xCell) | (this.separateBit32(yCell) << 1)
  }

  /**
   * エンティティの所属レベルを算出する
   */
  private calcLevel(leftTopMorton: number, rightBottomMorton: number): number {
    // XORを取った数を2bitずつ右シフトして、
    // 0でない数が捨てられたときのシフト回数を採用する
    const xorMorton = leftTopMorton ^ rightBottomMorton
    let level = this.maxLevel - 1
    let attachedLevel = this.maxLevel

    for (let i = 0; level >= 0; i++) {
      const flag = (xorMorton >> (i * 2)) & 0x3
      if (flag > 0) {
        attachedLevel = level
      }

      level--
    }

    return attachedLevel
  }

  /**
   * モートン番号からレベル内のセル番号を算出する
   */
  private calcCell(morton: number, level: number): number {
    const shift = (this.maxLevel - level) * 2
    return morton >> shift
  }
}
