import { MainLoopTaskType } from './server'

class EventQueue {
  static eventQueue: string[] = []

  insertEventQueue(eventName: string): void {
    EventQueue.eventQueue.push(eventName)
  }

  async executeEvent(eventType: MainLoopTaskType): Promise<MainLoopTaskType> {
    if (EventQueue.eventQueue.length > 0) {
      switch (EventQueue.eventQueue.pop()) {
        case 'timestop':
          return await this.executeEvent(await this.timeStop())
        default:
          return eventType
      }
    } else {
      return eventType
    }
  }

  // 実行後は通常のメインループに戻るために空strを返す
  async timeStop(): Promise<MainLoopTaskType> {
    await sleep(10000)
    return 'main'
  }
}

async function sleep(ms: number): Promise<unknown> {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

export default EventQueue
