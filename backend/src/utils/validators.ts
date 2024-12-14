import { LIMITS } from '@/constants/limits';
import { TrashcanRequest } from '@/dto/trashcan/request';
import { Coordinates } from '@/types/coordinates';
import { GarbageTypes } from '@/types/garbageTypes';
import { TrashcanFilters } from '@/types/trashcanFilters';

export const validateRange = (numberValue: number, min: number, max: number): boolean => {
    if (numberValue || numberValue === 0) {
        return numberValue >= min && numberValue <= max;
    }
    return false;
};

export const validateCoordinates = (coordinates: Coordinates): boolean => {
    return Boolean(coordinates.lat && coordinates.lng) || coordinates.lat * coordinates.lng === 0;
};

export const validateTrashcanType = (trashcanType: GarbageTypes) => {
    return GarbageTypes[trashcanType];
};

export const validateTrashcan = ({ type, coordinates, fill, volume }: TrashcanRequest) => {
    return (
        validateCoordinates(coordinates) &&
        validateTrashcanType(type) &&
        validateRange(fill, LIMITS.FILL_MIN, LIMITS.FILL_MAX) &&
        validateRange(volume, LIMITS.VOLUME_MIN, LIMITS.VOLUME_MAX)
    );
};

type FilterField = {
    $gt?: number;
    $lt?: number;
};

const validateFilterField = (filter: FilterField | undefined, min: number, max: number) => {
    if (!filter) {
        return true;
    }
    const { $gt, $lt } = filter;
    if ($gt !== undefined && !validateRange($gt, min, max)) {
        return false;
    }
    if ($lt !== undefined && !validateRange($lt, min, max)) {
        return false;
    }
    if ($gt !== undefined && $lt !== undefined) {
        return $gt < $lt;
    }
    return true;
};

export const validateTrashcanFilter = ({ type, fill, volume }: TrashcanFilters) => {
    const areValidTypes = type ? type.filter((t) => validateTrashcanType(t)).length === type.length : true;
    return (
        areValidTypes &&
        validateFilterField(volume, LIMITS.VOLUME_MIN, LIMITS.VOLUME_MAX) &&
        validateFilterField(fill, LIMITS.FILL_MIN, LIMITS.FILL_MAX)
    );
};
