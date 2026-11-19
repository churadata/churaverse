import type { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client'
import { BlackHolePlugin } from '@churaverse/churaren-black-hole-plugin-client'
import { ExplosionPlugin } from '@churaverse/churaren-explosion-plugin-client'
import { FlamePillarPlugin } from '@churaverse/churaren-flame-pillar-plugin-client'
import { HealingPotionPlugin } from '@churaverse/churaren-healing-potion-plugin-client'
import { IceArrowPlugin } from '@churaverse/churaren-ice-arrow-plugin-client'
import { RevivalItemPlugin } from '@churaverse/churaren-revival-item-plugin-client'
import { TornadoPlugin } from '@churaverse/churaren-tornado-plugin-client'
import { TrapPlugin } from '@churaverse/churaren-trap-plugin-client'
import { WaterRingPlugin } from '@churaverse/churaren-water-ring-plugin-client'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [
  HealingPotionPlugin,
  RevivalItemPlugin,
  ExplosionPlugin,
  BlackHolePlugin,
  TornadoPlugin,
  FlamePillarPlugin,
  WaterRingPlugin,
  TrapPlugin,
  IceArrowPlugin,
]
