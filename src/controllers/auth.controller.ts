import { Request, Response } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { logger } from "..";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check if the password matches
    const passwordMatch = await Bun.password.verify(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate a new access token (with enough lifetime for the whole hunt)
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "36h",
    });

    return res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        admin: user.admin,
        requiresPasswordChange: user.requiresPasswordChange,
      },
    });
  } catch (error) {
    logger.error("Error logging in", error);
    return res.status(500).json({ message: "Login failed" });
  }
}

export async function updatePassword(req: Request, res: Response) {
  const { oldPassword, newPassword } = req.body;
  const user = req.user!;

  // check if old password is correct
  if (!(await Bun.password.verify(oldPassword, user.password))) {
    return res.status(401).json({
      message: "Old password is incorrect",
    });
  }

  const hashed = await Bun.password.hash(newPassword);
  user.password = hashed;
  user.requiresPasswordChange = false;

  await user.save();
  return res.status(200).json({ message: "Password updated" });
}
