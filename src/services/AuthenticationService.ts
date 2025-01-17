import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, BadRequestWithMessage, ServiceResponse } from "$entities/Service";
import Logger from '$pkg/logger';
import bcrypt from 'bcrypt';
import { prisma } from '$utils/prisma.utils';
import jwt from 'jsonwebtoken';
require('dotenv').config();

interface AuthenticateData {
    email: string;
    password: string;
}

export async function authenticate(data: AuthenticateData):Promise<ServiceResponse<{}>>{
    try {
        // get one user by email
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            return BadRequestWithMessage('User not found');
        }

        // how to verify bcrypt
        const result = await bcrypt.compare(data.password, user.password);
        if (!result) {
            return BadRequestWithMessage('Password incorrect');
        }
        
        const secret = process.env.JWT_SECRET as string;
        const token = jwt.sign(user, secret, { expiresIn: '1h' });

        return {
            status: true,
            data: { user, token }
        }
    } catch(err) {
        Logger.error(`AuthenticationService.authenticate : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}