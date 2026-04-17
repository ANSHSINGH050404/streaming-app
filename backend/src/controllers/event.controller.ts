import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { sendBookingEmail } from "../utils/mailer";

export const createEvent = async (req: Request, res: Response) => {
  const adminId = req.admin?.id;
  const {
    name,
    description,
    type,
    tag,
    venue,
    date,
    capacity,
    price,
    amenities,
  } = req.body;

  if (!adminId) {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  if (
    !name ||
    !description ||
    !type ||
    !venue ||
    !date ||
    capacity === undefined ||
    price === undefined
  ) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const event = await prisma.event.create({
      data: {
        name,
        description,
        type,
        tag,
        venue,
        date: new Date(date),
        capacity: Number(capacity),
        price: Number(price),
        amenities: Array.isArray(amenities) ? amenities : [],
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
  const {
    name,
    description,
    type,
    tag,
    venue,
    date,
    capacity,
    price,
    amenities,
    available,
  } = req.body;
  const adminId = req.admin?.id;

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: id as string },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (existingEvent.adminId !== adminId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: id as string },
      data: {
        name,
        description,
        type,
        tag,
        venue,
        date: date ? new Date(date) : undefined,
        capacity: capacity !== undefined ? Number(capacity) : undefined,
        price: price !== undefined ? Number(price) : undefined,
        amenities: Array.isArray(amenities) ? amenities : undefined,
        available: available !== undefined ? Boolean(available) : undefined,
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
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
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

export const bookEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const quantity = req.body;

  if (!userId) {
    return res.status(401).json({ message: "User authentication required" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: id as string },
    });

    if (!event) {
      return res.status(404).json({ message: "Event name not found" });
    }

    const { quantity, type } = req.body;

    if (!quantity || !type) {
      return res.status(400).json({ message: "Quantity and type are required" });
    }

    if (!event.available || event.capacity < quantity) {
      return res
        .status(400)
        .json({ message: "Event is fully booked or unavailable" });
    }

    // Create booking and decrement capacity
    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          eventId: event.id,
          userId: userId,
          seats: {
            create: {
              quantity: Number(quantity),
              type: type,
              userId: userId,
              eventId: event.id,
            },
          },
        },
        include: {
          user: true,
          event: true,
        },
      }),
      prisma.event.update({
        where: { id: event.id },
        data: {
          capacity: {
            decrement: Number(quantity),
          },
          available: event.capacity - Number(quantity) > 0,
        },
      }),
    ]);

    // Send email in background
    if (booking.user.email) {
      sendBookingEmail(booking.user.email, booking.id, {
        name: booking.event.name,
        date: booking.event.date,
        venue: booking.event.venue,
        seats: Number(quantity),
        type: type,
      }).catch((err) => console.error("Failed to send booking email:", err));
    }

    return res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Booking failed" });
  }
};

export const verifyBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            phone_number: true,
            email: true,
          },
        },
        event: {
          select: {
            name: true,
            date: true,
            venue: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.checkedIn) {
      return res.status(400).json({
        message: "Ticket already used",
        checkedInAt: booking.checkInAt,
        booking,
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        checkedIn: true,
        checkInAt: new Date(),
      },
    });

    return res.json({
      message: "Check-in successful",
      booking: {
        ...updatedBooking,
        user: booking.user,
        event: booking.event,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Verification failed" });
  }
};
