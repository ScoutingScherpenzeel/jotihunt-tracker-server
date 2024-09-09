import { Request, Response } from "express";
import { User } from "../models/user.model";
import { logger } from "..";
import { body, matchedData, validationResult } from "express-validator";

export async function getUsers(req: Request, res: Response) {
  const users = await User.find().select("-password");
  return res.status(200).json(users);
}

export async function createUser(req: Request, res: Response) {
  const data = matchedData(req);

  try {
    const hashedPassword = await Bun.password.hash(data.password);
    const user = new User({
      name: data.name,
      email: data.email,
      admin: data.admin,
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

  try {
    const user = await User.findById(id);
    await user!.deleteOne();

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    logger.error("Error deleting user", error);
    return res.status(500).json({ message: "Error deleting user" });
  }
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const data = matchedData(req);

  try {
    const user = await User.findById(id)!;
    if (!user) return;

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.admin) user.admin = data.admin;
    if (data.password) user.password = await Bun.password.hash(data.password);

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error updating user", error);
    return res.status(500).json({ message: "Error updating user" });
  }
}
