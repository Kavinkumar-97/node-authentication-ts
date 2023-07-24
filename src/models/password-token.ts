import { Schema, model, Document } from 'mongoose';
import { IUser } from '@models/user';

interface IPasswordToken extends Document {
  token: string;
  isValid: boolean;
  user: Schema.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const passwordTokenSchema = new Schema<IPasswordToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const PasswordToken = model<IPasswordToken>(
  'PasswordToken',
  passwordTokenSchema,
);

export default PasswordToken;
