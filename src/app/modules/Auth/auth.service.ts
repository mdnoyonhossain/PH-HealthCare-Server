import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from 'bcrypt';
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

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

    const accessToken = jwtHelpers.generateToken(jwtPayload, config.jwt.access_token_secret as Secret, config.jwt.access_token_expires_in as string);

    const refreshToken = jwtHelpers.generateToken(jwtPayload, config.jwt.refresh_token_secret as Secret, config.jwt.refresh_token_expires_in as string);

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    }
}

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as string);
    }
    catch (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not Authorized!')
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

    const accessToken = jwtHelpers.generateToken(jwtPayload, config.jwt.access_token_secret as Secret, config.jwt.access_token_expires_in as string);

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    }
}

export const AuthServices = {
    loginUser,
    refreshToken
}