import { Roles, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const authenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication token missing" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as {
            id: number;
            fullName: string;
            password: string;
            email: string;
            role: Roles;
            createdAt: Date;
            updatedAt: Date;
        };

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};