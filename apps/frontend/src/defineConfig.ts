/* eslint-disable @typescript-eslint/naming-convention */
// import { BombPlugin,
//   CoreUiPlugin,
//   KeyboardPlugin,
//   MapPlugin,
//   NetworkPlugin,
//   PlayerPlugin,
//   SharkPlugin,
//   TransitionPlugin,
//   TextChatPlugin,
//   WebRtcPlugin,
//   GroundScreenPlugin,
//   ScreenSharePlugin,
//   PlayerListPlugin,
//   TitleCoreUiPlugin,
//   TitlePlayerPlugin,
//   VersionDisplayPlugin,
//   KickPlugin,
//   PopUpScreenListPlugin,
//   CameraVideoChatPlugin,
//   VoiceChatPlugin,
//   DebugScreenPlugin,
// } from 'churaverse-plugins-client'
import { BombPlugin } from '@churaverse/bomb-plugin-client'
import { CameraVideoChatPlugin } from '@churaverse/camera-video-chat-plugin-client'
import { churarenPlugins } from '@churaverse/churaren-plugins-client'
import { CoreUiPlugin } from '@churaverse/core-ui-plugin-client'
import { DataPersistencePlugin } from '@churaverse/data-persistence-plugin-client'
import { DebugScreenPlugin } from '@churaverse/debug-screen-plugin-client'
import { GamePlugin } from '@churaverse/game-plugin-client'
import { GroundScreenPlugin } from '@churaverse/ground-screen-plugin-client'
import { KeyboardPlugin } from '@churaverse/keyboard-plugin-client'
import { KickPlugin } from '@churaverse/kick-plugin-client'
import { MapPlugin } from '@churaverse/map-plugin-client'
import { NetworkPlugin } from '@churaverse/network-plugin-client'
import { PlayerListPlugin } from '@churaverse/player-list-plugin-client'
import { PlayerPlugin } from '@churaverse/player-plugin-client'
import { PopUpScreenListPlugin } from '@churaverse/popup-screen-list-plugin-client'
import { ScreenSharePlugin } from '@churaverse/screen-share-plugin-client'
import { SharkPlugin } from '@churaverse/shark-plugin-client'
import { SynchroBreakPlugin } from '@churaverse/synchro-break-plugin-client'
import { TextChatPlugin } from '@churaverse/text-chat-plugin-client'
import { TitleCoreUiPlugin, TitlePlayerPlugin, VersionDisplayPlugin } from '@churaverse/title-plugin-client'
import { TransitionPlugin } from '@churaverse/transition-plugin-client'
import { VoiceChatPlugin } from '@churaverse/voice-chat-plugin-client'
import { WebRtcPlugin } from '@churaverse/web-rtc-plugin-client'
import { defineChuraverseConfig, type IPluginConfig } from 'churaverse-engine-client'

const getUrl = (url: string, useWebSocket: boolean = false): string => {
  // スキームがある場合はそのまま返す
  if (/^(https?|wss?):\/\//.test(url)) {
    return url
  }
  // 相対URLの場合は現在のホストを使って完全なURLを生成
  const protocol = useWebSocket ? (window.location.protocol === 'https:' ? 'wss:' : 'ws:') : window.location.protocol
  return `${protocol}//${window.location.host}${url}`
}

export function defineConfig(): void {
  const pluginConfig: IPluginConfig = {
    plugins: {
      MainScene: [
        TransitionPlugin,
        NetworkPlugin,
        DataPersistencePlugin,
        KeyboardPlugin,
        DebugScreenPlugin,
        MapPlugin,
        CoreUiPlugin,
        PlayerPlugin,
        GroundScreenPlugin,
        WebRtcPlugin,
        ScreenSharePlugin,
        SharkPlugin,
        BombPlugin,
        TextChatPlugin,
        PlayerListPlugin,
        KickPlugin,
        VoiceChatPlugin,
        PopUpScreenListPlugin,
        CameraVideoChatPlugin,
        GamePlugin,
        SynchroBreakPlugin,
        ...churarenPlugins,
      ],
      TitleScene: [
        TransitionPlugin,
        NetworkPlugin,
        KeyboardPlugin,
        TitlePlayerPlugin,
        TitleCoreUiPlugin,
        VersionDisplayPlugin,
      ],
    },
  }

  defineChuraverseConfig({
    backendUrl: getUrl(import.meta.env.VITE_BACKEND_URL),
    backendLivekitUrl: getUrl(import.meta.env.VITE_BACKEND_LIVEKIT_URL),
    livekitUrl: getUrl(import.meta.env.VITE_LIVEKIT_URL, true),
    pluginConfig,
  })
}
