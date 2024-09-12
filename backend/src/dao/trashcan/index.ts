import mongoose, { Model, Schema } from 'mongoose';
import { Trashcan } from '@/entity/trashcan';
import { MODELS } from '@/constants/models';
import { GarbageTypes } from '@/types/garbageTypes';

type TrashcanModel = Model<Trashcan>;

const TrashcanSchema = new Schema<Trashcan, TrashcanModel>({
    id: { type: String },
    coordinates: {
        lat: { type: String, required: true },
        lng: { type: String, required: true },
    },
    type: { type: String, enum: GarbageTypes, required: true },
    volume: { type: Number, required: true },
    fill: { type: Number },
    image: { type: String, required: true },
});

export const TrashcanDAO = mongoose.model(MODELS.TRASHCAN, TrashcanSchema);
