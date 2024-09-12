import { Coordinates } from '@/types/coordinates';
import { GarbageTypes } from '@/types/garbageTypes';

export type TrashcanRequest = {
    id?: string;
    coordinates: Coordinates;
    type: GarbageTypes;
    volume: number;
    fill: number;
};
