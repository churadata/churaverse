export class DataDumper {
  private readonly dumpData: DumpData

  public constructor() {
    this.dumpData = {}
  }

  public dump(key: DumpDataKey, value: string) {
    this.dumpData[key] = value
  }

  public saveJsonToFile(): void {
    const jsonStr = JSON.stringify(this.dumpData, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const debugData = document.createElement('a')
    debugData.href = url
    debugData.download = 'debug_data.json'
    debugData.click()
    URL.revokeObjectURL(url)
  }
}

interface DumpData {
  [key: string]: string
}

export interface DumpDataMap {}

export type DumpDataKey = keyof DumpDataMap
