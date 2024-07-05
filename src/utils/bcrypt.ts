import bcrypt from "bcryptjs";

export const hashText = (text: string): string => bcrypt.hashSync(text);
export const compareHashWithText = (text: string, hash: string): boolean =>
  bcrypt.compareSync(text, hash);
