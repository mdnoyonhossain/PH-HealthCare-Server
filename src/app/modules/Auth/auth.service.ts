import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from 'bcrypt';

const loginUser = async (payload: {
    email: string;
    password: string;
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error('Password Incorrect!');
    }

    const jwtPayload = {
        email: userData.email,
        role: userData.role
    }

    const accessToken = jwtHelpers.generateToken(jwtPayload, 'abcdefghij', '5m');

    const refreshToken = jwtHelpers.generateToken(jwtPayload, 'abcdefghijklmnopqrst', '30d');

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    }
}

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, 'abcdefghijklmnopqrst');
    }
    catch (err) {
        throw new Error('You are not Authorized!')
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const jwtPayload = {
        email: userData.email,
        role: userData.role
    }

    const accessToken = jwtHelpers.generateToken(jwtPayload, 'abcdefghij', '5m');

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    }
}

export const AuthServices = {
    loginUser,
    refreshToken
}