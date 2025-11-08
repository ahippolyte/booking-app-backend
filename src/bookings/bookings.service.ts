import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string) {
    const where = userId ? { userId } : {};
    
    return this.prisma.booking.findMany({
      where,
      include: {
        property: {
          include: {
            images: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            images: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async create(data: {
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalPrice: number;
    cleaningFee?: number;
    discount?: number;
    guestFirstName: string;
    guestLastName: string;
    guestEmail: string;
    guestPhone: string;
    userId: string;
    propertyId: string;
  }) {
    return this.prisma.booking.create({
      data,
      include: {
        property: {
          include: {
            images: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') {
    await this.findOne(id);
    
    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async cancel(id: string) {
    return this.updateStatus(id, 'CANCELLED');
  }
}
