import { alchemyItemPlugins } from '@churaverse/churaren-alchemy-item-plugins-server'
import { ChurarenAlchemyPlugin } from '@churaverse/churaren-alchemy-plugin-server'
import { ChurarenBossAttackPlugin } from '@churaverse/churaren-boss-attack-plugin-server'
import { ChurarenBossPlugin } from '@churaverse/churaren-boss-plugin-server'
import { ChurarenCorePlugin } from '@churaverse/churaren-core-plugin-server'
import { ChurarenItemPlugin } from '@churaverse/churaren-item-plugin-server'
import { ChurarenPlayerPlugin } from '@churaverse/churaren-player-plugin-server'
import type { BaseGamePlugin } from '@churaverse/game-plugin-server'
import '@churaverse/game-plugin-server'

export const churarenPlugins: Array<typeof BaseGamePlugin> = [
  ChurarenCorePlugin,
  ChurarenBossPlugin,
  ChurarenItemPlugin,
  ChurarenPlayerPlugin,
  ChurarenBossAttackPlugin,
  ChurarenAlchemyPlugin,
  ...alchemyItemPlugins,
]
