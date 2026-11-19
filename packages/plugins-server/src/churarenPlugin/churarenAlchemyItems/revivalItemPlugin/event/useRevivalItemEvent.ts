// NOTE: 本来このイベントはrevivalItemPluginが持つべきだが、
// playerPlugin ↔ revivalItemPlugin ↔ alchemyPlugin ↔ playerPlugin の循環依存を解消するため
// 暫定的にcorePluginに移動している
export { UseRevivalItemEvent } from '@churaverse/churaren-core-plugin-server'
