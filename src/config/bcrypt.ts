import bcrypt from 'bcrypt';

const saltRound = 10;

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(password, salt);
  } catch (e) {
    throw new Error('Error while hashing password');
  }
};

export const checkPassword = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (e) {
    throw new Error('Failed to compare password');
  }
};
