import type { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server'
import { BlackHolePlugin } from '@churaverse/churaren-black-hole-plugin-server'
import { ExplosionPlugin } from '@churaverse/churaren-explosion-plugin-server'
import { FlamePillarPlugin } from '@churaverse/churaren-flame-pillar-plugin-server'
import { HealingPotionPlugin } from '@churaverse/churaren-healing-potion-plugin-server'
import { IceArrowPlugin } from '@churaverse/churaren-ice-arrow-plugin-server'
import { RevivalItemPlugin } from '@churaverse/churaren-revival-item-plugin-server'
import { TornadoPlugin } from '@churaverse/churaren-tornado-plugin-server'
import { TrapPlugin } from '@churaverse/churaren-trap-plugin-server'
import { WaterRingPlugin } from '@churaverse/churaren-water-ring-plugin-server'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [
  HealingPotionPlugin,
  RevivalItemPlugin,
  ExplosionPlugin,
  BlackHolePlugin,
  TornadoPlugin,
  WaterRingPlugin,
  FlamePillarPlugin,
  TrapPlugin,
  IceArrowPlugin,
]
