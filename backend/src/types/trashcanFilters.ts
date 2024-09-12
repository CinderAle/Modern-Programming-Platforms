import { GarbageTypes } from './garbageTypes';

export type TrashcanFilters = {
    type?: GarbageTypes;
    volume?: { $gt?: number; $lt?: number };
    fill?: { $gt?: number; $lt?: number };
};
