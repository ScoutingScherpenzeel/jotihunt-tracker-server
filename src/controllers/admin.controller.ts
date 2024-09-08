import { Request, Response } from "express";
import { User } from "../models/user.model";
import { logger } from "..";

export async function getUsers(req: Request, res: Response) {
  const users = await User.find().select("-password");
  return res.status(200).json(users);
}

export async function createUser(req: Request, res: Response) {
  const { name, email, password, admin } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required",
    });
  }

  try {
    const hashedPassword = await Bun.password.hash(password);
    const user = new User({
      name,
      email,
      admin,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    logger.error("Error creating user", error);
    return res.status(500).json({ message: "Error creating user" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "ID is required",
    });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    logger.error("Error deleting user", error);
    return res.status(500).json({ message: "Error deleting user" });
  }
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const { name, email, admin, password } = req.body;

  if (!id || !name || !email) {
    return res.status(400).json({
      message: "ID, name and email are required",
    });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name;
    user.email = email;
    user.admin = admin;

    if (password) {
      user.password = await Bun.password.hash(password);
    }

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error updating user", error);
    return res.status(500).json({ message: "Error updating user" });
  }
}
