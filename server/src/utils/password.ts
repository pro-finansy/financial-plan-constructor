import bcrypt from 'bcryptjs';
export const create = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const check = (password: string, currentPassword: string) => bcrypt.compareSync(password, currentPassword);
export default { create, check };