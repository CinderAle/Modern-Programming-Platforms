import { MODELS } from '@/constants/models';
import { Token } from '@/entity/token';
import { UserRoles } from '@/types/userRoles';
import mongoose, { Model, Schema } from 'mongoose';

type RefreshTokenModel = Model<Token>;

const RefreshTokenSchema = new Schema<Token, RefreshTokenModel>({
    active: { type: Boolean, required: true },
    token: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
});

export const RefreshTokenDAO = mongoose.model(MODELS.REFRESH_TOKEN, RefreshTokenSchema);
