/* eslint-disable @typescript-eslint/naming-convention */

import { BombPlugin } from '@churaverse/bomb-plugin-server'
import { churarenPlugins } from '@churaverse/churaren-plugins-server'
import { CollisionDetectionPlugin } from '@churaverse/collision-detection-plugin-server'
import { GamePlugin } from '@churaverse/game-plugin-server'
import { KickPlugin } from '@churaverse/kick-plugin-server'
import { MapPlugin } from '@churaverse/map-plugin-server'
import { NetworkPlugin } from '@churaverse/network-plugin-server'
import { PlayerPlugin, TitlePlayerPlugin } from '@churaverse/player-plugin-server'
import { SharkPlugin } from '@churaverse/shark-plugin-server'
import { SynchroBreakPlugin } from '@churaverse/synchro-break-plugin-server'
import { TextChatPlugin } from '@churaverse/textchat-plugin-server'
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
        GamePlugin,
        SynchroBreakPlugin,
        ...churarenPlugins,
      ],
      TitleScene: [NetworkPlugin, TitlePlayerPlugin],
    },
  }

  defineChuraverseConfig({
    pluginConfig,
  })
}
