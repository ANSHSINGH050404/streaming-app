import type { Request, Response } from "express";
import { prisma } from "../config/db";
import authenticator from "authenticator";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { username, phone_number } = req.body;
  if (!phone_number) {
    return res.status(400).json({ error: "phone_number is required" });
  }
  try {
    const user = await prisma.user.upsert({
      where: {
        phone_number: phone_number,
      },
      create: {
        username,
        phone_number,
      },
      update: {
        username,
      },
    });

    const otp = authenticator.generateToken(phone_number);
    res.status(201).json({
      user,
      otp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create or update user" });
  }
};

export const verify = async (req: Request, res: Response) => {
  const { phone_number, otp } = req.body;
  if (!phone_number || !otp) {
    return res.status(400).json({ error: "phone_number and otp are required" });
  }

  const isValid = authenticator.verifyToken(phone_number, otp);

  if (isValid) {
    try {
      const user = await prisma.user.update({
        where: { phone_number },
        data: { verified: true },
      });
      const token = jwt.sign(
        { phone_number: user.phone_number, role: "user" },
        process.env.JWT_SECRET!,
      );
      res.json({ message: "Verification successful", user, token });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user status" });
    }
  } else {
    res.status(401).json({ error: "Invalid OTP" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: id as string },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, verified } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: id as string },
      data: {
        username,
        verified,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: id as string },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
