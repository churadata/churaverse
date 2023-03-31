import AsyncLock from 'async-lock'

interface QueueData {
  [prop: string]: any // object[];
}

const lock = new AsyncLock({ timeout: 1000 * 30 })

export type SendTarget = 'sendEveryone' | 'sendOther'

class OutputDataQueue {

  static receiveQueueData: QueueData = {}
  static transmitQueueData: QueueData = {}

  tmpQueueData: QueueData = {}

  initTargetData(socketId: string): void {
    OutputDataQueue.transmitQueueData[socketId] = []
    OutputDataQueue.receiveQueueData[socketId] = []
  }

  addUserQueueData(socketId: string): void {
    void lock.acquire('receiveQueue', async () => {
      OutputDataQueue.receiveQueueData[socketId] = []
      OutputDataQueue.transmitQueueData[socketId] = []
    })
  }

  // 受信キューにinsertするfunc.ここに排他制御を適用する
  async insertReceiveQueueData(
    receiveData: QueueData,
    dataTypeToSend: SendTarget
  ): Promise<void> {
    void lock.acquire('receiveQueue', async () => {
      OutputDataQueue.receiveQueueData[receiveData.id] = receiveData
    })
    void this.insertTransmitQueueData(receiveData.id, dataTypeToSend)
  }

  // 送信キューに処理したdataをinsertするfunc
  async insertTransmitQueueData(
    socketId: string,
    dataTypeToSend: SendTarget
  ): Promise<void> {
    await lock.acquire('receiveQueue', async () => {
      this.tmpQueueData = OutputDataQueue.receiveQueueData[socketId]
    })
    const playerData = this.tmpQueueData
    const infoTmpl: QueueData = {
      id: playerData.id,
    }

    for (const actionData of playerData.actions) {
      const actionType = actionData.type
      switch (dataTypeToSend) {
        case 'sendEveryone':
          OutputDataQueue.insertAllTransmitQueue(
            this.unPack(actionData, actionType, infoTmpl)
          )
          break
        case 'sendOther':
          this.insertEachSocketId(
            this.unPack(actionData, actionType, infoTmpl),
            playerData.id
          )
          break
      }
    }
  }

  // shark: [サメの情報1, サメの情報2, サメの情報3]を受け取って
  // [{shark: サメの情報1}, {shark: サメの情報1}, {shark: サメの情報3}]に直す関数
  // Unpackで良いと思う
  private unPack(
    actionData: QueueData,
    actionType: string,
    infoTmpl: QueueData
  ): QueueData[] {
    const returnData: QueueData[] = []

    for (const value of actionData.infos) {
      const tmp: { [prop: string]: object[] } = value
      Object.assign(tmp, infoTmpl)
      returnData.push({ type: actionType, info: tmp })
    }

    return returnData
  }

  // QueueDataにはsocketId(ユーザー)毎にデータが作成される。
  // 送られてきたユーザーに返す値に自身のデータを格納しないようにしている
  private insertEachSocketId(
    actionsData: QueueData[],
    receiveSocketId: string
  ): void {
    Object.keys(OutputDataQueue.transmitQueueData).forEach((socketId) => {
      if (socketId !== receiveSocketId) {
        void lock.acquire('transmitQueue', async () => {
          OutputDataQueue.transmitQueueData[socketId] =
            OutputDataQueue.transmitQueueData[socketId].concat(actionsData)
        })
      }
    })
  }

  // 全ユーザーの送信キューにデータを格納する
  static insertAllTransmitQueue(actionsData: QueueData[]): void {
    Object.keys(OutputDataQueue.transmitQueueData).forEach((socketId) => {
      void lock.acquire('transmitQueue', async () => {
        // console.log(OutputDataQueue.transmitQueueData[socketId])
        OutputDataQueue.transmitQueueData[socketId] =
          OutputDataQueue.transmitQueueData[socketId].concat(actionsData)
      })
    })
  }

  // idで指定したユーザの送信キューにデータを格納する
  static insertOneTransmitQueue(
    actionsData: QueueData[],
    receiveSocketId: string
  ): void {
    void lock.acquire('transmitQueue', async () => {
      OutputDataQueue.transmitQueueData[receiveSocketId] =
        OutputDataQueue.transmitQueueData[receiveSocketId].concat(actionsData)
    })
  }

  // idで指定したユーザ以外の送信キューにデータを格納する
  static insertExcludeTransmitQueue(
    actionsData: QueueData[],
    excludeIds: string[]
  ): void {
    Object.keys(OutputDataQueue.transmitQueueData).forEach((socketId) => {
      if (!excludeIds.includes(socketId)) {
        void lock.acquire('transmitQueue', async () => {
          OutputDataQueue.transmitQueueData[socketId] =
            OutputDataQueue.transmitQueueData[socketId].concat(actionsData)
        })
      }
    })
  }

  async getQueueData(): Promise<QueueData> {
    await lock.acquire('transmitQueue', async () => {
      this.tmpQueueData = OutputDataQueue.transmitQueueData
    })
    return this.tmpQueueData
  }
}

// これはtest用のコードのため現状そのまま
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function testRandomSleep(): Promise<unknown> {
  let rag: number = 0
  if (Math.random() < 0.5) {
    rag = 5000
  }
  console.log('ラグ', rag)
  return await new Promise((resolve) => setTimeout(resolve, rag))
}

export default OutputDataQueue
