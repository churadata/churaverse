import { BufferType } from './types'

/**
 * ActionHelperでデータをまとめておくるためのバッファ
 */
export class SocketBuffer<T> {
  private readonly bufferType: BufferType
  private buffer: T[] = []

  public constructor(bufferType: BufferType) {
    this.bufferType = bufferType
  }

  /**
   * データの追加
   * タイプによって挙動が変わる
   * @param data
   */
  public addData(data: T): void {
    switch (this.bufferType) {
      case BufferType.FirstOnly:
        if (this.buffer.length === 0) {
          this.buffer = [data]
        }
        break
      case BufferType.LastOnly:
        this.buffer = [data]
        break
      case BufferType.Queue:
        this.buffer.push(data)
        break
      case BufferType.Stack:
        this.buffer.unshift(data)
        break
    }
  }

  /**
   * データの消去
   */
  public remove(): void {
    this.buffer.length = 0
  }

  /**
   * データの取得
   * @returns データ全部
   */
  public getData(): T[] {
    // deepcopyをreturn
    return [...this.buffer]
  }

  /**
   * データの存在の確認
   * @returns データが存在するか
   */
  public hasData(): boolean {
    return this.buffer.length > 0
  }
}
