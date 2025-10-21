import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { logger } from "..";

export default async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded._id);

    if (!user) {
      logger.error("User not found with ID", decoded._id);
      return res.status(401).json({
        message: "Access denied",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Access denied",
    });
  }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      message: "Access denied",
    });
  }

  if (!req.user.admin) {
    return res.status(401).json({
      message: "Access denied",
    });
  }

  next();
}

interface JwtPayload {
  _id: string;
}
