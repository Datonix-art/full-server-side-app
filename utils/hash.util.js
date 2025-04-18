import bcrypt from 'bcrypt';
const saltRound = 10;

export const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword
}

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}