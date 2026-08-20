import { banrisul } from './banrisul';
import type { BrokerConfig } from './types';

export type { BrokerConfig, BrokerWidget } from './types';

/** Catálogo de corretoras. Novas corretoras: criar arquivo em src/brokers/ e registrar aqui. */
export const brokers = {
  banrisul,
} as const;

export type BrokerId = keyof typeof brokers;

export function getBroker(id: BrokerId): BrokerConfig {
  return brokers[id];
}
