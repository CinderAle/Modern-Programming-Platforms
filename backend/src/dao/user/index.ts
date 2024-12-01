import { MODELS } from '@/constants/models';
import { User } from '@/entity/user';
import { UserRoles } from '@/types/userRoles';
import mongoose, { Model, Schema } from 'mongoose';

type UserModel = Model<User>;

const UserSchema = new Schema<User, UserModel>({
    id: { type: String, index: true },
    role: { type: String, enum: UserRoles, required: true },
    login: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    password: { type: String, required: true },
});

export const UserDAO = mongoose.model(MODELS.USER, UserSchema);
