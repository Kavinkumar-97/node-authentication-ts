import { Schema, model, Document } from 'mongoose';
import { hashPassword, checkPassword } from '@config/bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  
  checkPassword(password: string) : Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // If password is modified we need to hash the new password and update
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (e) {
    console.error(e);
    next(new Error('Unable to save the user'));
  }
});

userSchema.methods.checkPassword = async function (
  password: string,
): Promise<boolean> {
  return await checkPassword(password, this.password);
};

const User = model<IUser>('User', userSchema);

export default User;
