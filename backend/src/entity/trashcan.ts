import { Coordinates } from '@/types/coordinates';
import { GarbageTypes } from '@/types/garbageTypes';

export class Trashcan {
    private _id: string;
    private _coordinates: Coordinates;
    private _type: GarbageTypes;
    private _volume: number;
    private _fill: number;

    constructor(id: string, coordinates: Coordinates, type: GarbageTypes, volume: number, fill: number = 0) {
        this._id = id;
        this._coordinates = coordinates;
        this._type = type;
        this._volume = volume;
        this._fill = fill;
    }

    get id() {
        return this._id;
    }

    get coordinates() {
        return this._coordinates;
    }

    get type() {
        return this._type;
    }

    get volume() {
        return this._volume;
    }

    get fill() {
        return this._fill;
    }

    set fill(fill: number) {
        this._fill = fill;
    }
}
