import { AsmaAlHusnaModel } from '../model/asma-al-husna.model';

export const ASMA_AL_HUSNA_PERSISTENCE_PORT = Symbol(
  'ASMA_AL_HUSNA_PERSISTENCE_PORT',
);

export interface AsmaAlHusnaPersistencePort {
  findActive(): Promise<AsmaAlHusnaModel[]>;
  findActiveByNumber(number: number): Promise<AsmaAlHusnaModel | null>;
}
