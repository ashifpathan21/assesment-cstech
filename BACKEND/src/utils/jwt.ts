import jwt, { JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
}
export const signToken = (data: string) => {
    return jwt.sign(data, JWT_SECRET, { expiresIn: '1d' })
}

export const decodeToken = (token: string) => {
    return jwt.decode(token);
}