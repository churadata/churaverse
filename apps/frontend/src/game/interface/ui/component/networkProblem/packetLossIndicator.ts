import { INetworkProblemIndicatorRender } from '../../../../interactor/IDialogIconRender'
import { logger } from 'churaverse-engine-client'

export const NETWORK_ISSUE_TEXTURE_PATH = 'assets/network_packetLoss.png'

export class PacketLossIndicator implements INetworkProblemIndicatorRender {
  private prevPacketLoss = 0

  public evaluateStats(rtcStats: RTCStatsReport, playerId?: string): boolean {
    let retValue: boolean = false
    // RTCStatsReportの型がReadonlyMap<string, any>で具体的な型がないためオブジェクト化しておく
    const rtcStatsForDebug = {}
    rtcStats.forEach((value) => {
      Object.assign(rtcStatsForDebug, { [value.type]: value })
    })

    // ユーザーから以下のデータを受け取ることでトレースできるようにする
    logger.debug(
      JSON.stringify(
        {
          playerId,
          rtcStatsReadableObject: rtcStatsForDebug,
        },
        null,
        '\t'
      )
    )

    // RTC Statsの中からパケットロスが発生しているかを判定する
    rtcStats.forEach((value) => {
      if (value.mediaType === 'audio') {
        if (value.type === 'inbound-rtp') {
          if (value.packetsLost - this.prevPacketLoss > 0) {
            // audioは累積値
            this.prevPacketLoss = value.packetsLost
            logger.warn('パケットロスが発生しました')
            retValue = true
          } else {
            retValue = retValue || false
          }
        }
      } else if (value.mediaType === 'video') {
        if (value.type === 'inbound-rtp') {
          if (value.packetsLost > 0) {
            // videoはフレームごとの値
            logger.warn('パケットロスが発生しました')
            retValue = true
          } else {
            retValue = retValue || false
          }
        }
      }
    })
    return retValue
  }
}
