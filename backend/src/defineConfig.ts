/* eslint-disable @typescript-eslint/naming-convention */
import { CollisionDetectionPlugin } from '@churaverse/collision-detection-plugin-server'
import { BombPlugin } from '@churaverse/bomb-plugin-server'
import { MapPlugin } from '@churaverse/map-plugin-server'
import { NetworkPlugin } from '@churaverse/network-plugin-server'
import { PlayerPlugin } from '@churaverse/player-plugin-server'
import { SharkPlugin } from '@churaverse/shark-plugin-server'
import { TextChatPlugin } from '@churaverse/textchat-plugin-server'
import { KickPlugin } from '@churaverse/kick-plugin-server'
import { VoiceChatPlugin } from '@churaverse/voicechat-plugin-server'
import { defineChuraverseConfig } from 'churaverse-engine-server'

export function defineConfig(): void {
  const pluginConfig = {
    plugins: {
      MainScene: [
        CollisionDetectionPlugin,
        NetworkPlugin,
        MapPlugin,
        PlayerPlugin,
        KickPlugin,
        SharkPlugin,
        BombPlugin,
        TextChatPlugin,
        VoiceChatPlugin,
      ],
      TitleScene: [NetworkPlugin],
    },
  }

  defineChuraverseConfig({
    pluginConfig,
  })
}
