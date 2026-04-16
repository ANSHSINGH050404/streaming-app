import type { Request, Response } from "express";
import { prisma } from "../config/db";

export const createEvent = async (req: Request, res: Response) => {
  const adminId = req.admin?.id;
  const { name, description } = req.body;

  if (!adminId) {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required" });
  }

  try {
    const event = await prisma.event.create({
      data: {
        name,
        description,
        adminId,
      },
    });
    return res.status(201).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        admin: {
          select: {
            username: true,
          },
        },
      },
    });
    return res.json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id: id as string },
      include: {
        admin: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const adminId = req.admin?.id;

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: id as string },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (existingEvent.adminId !== adminId) {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: id as string },
      data: {
        name,
        description,
      },
    });
    return res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminId = req.admin?.id;

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: id as string },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (existingEvent.adminId !== adminId) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await prisma.event.delete({
      where: { id: id as string },
    });
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
