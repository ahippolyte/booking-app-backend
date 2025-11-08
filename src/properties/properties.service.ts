import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyFilterDto } from './dto/property-filter.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: PropertyFilterDto) {
    const where: any = { isActive: true };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.minPrice) {
      where.pricePerNight = { ...where.pricePerNight, gte: filters.minPrice };
    }

    if (filters?.maxPrice) {
      where.pricePerNight = { ...where.pricePerNight, lte: filters.maxPrice };
    }

    if (filters?.guests) {
      where.guests = { gte: filters.guests };
    }

    if (filters?.bedrooms) {
      where.bedrooms = { gte: filters.bedrooms };
    }

    if (filters?.featured !== undefined) {
      where.featured = filters.featured;
    }

    return this.prisma.property.findMany({
      where,
      include: {
        images: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async findBySlug(slug: string) {
    const property = await this.prisma.property.findUnique({
      where: { slug },
      include: {
        images: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with slug ${slug} not found`);
    }

    return property;
  }

  async create(data: CreatePropertyDto) {
    const { images, amenityIds, ...propertyData } = data;

    return this.prisma.property.create({
      data: {
        ...propertyData,
        images: {
          create: images,
        },
        amenities: {
          create: amenityIds?.map((amenityId) => ({
            amenity: { connect: { id: amenityId } },
          })),
        },
      },
      include: {
        images: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdatePropertyDto) {
    const { images, amenityIds, ...propertyData } = data;

    // Check if property exists
    await this.findOne(id);

    return this.prisma.property.update({
      where: { id },
      data: {
        ...propertyData,
        ...(images && {
          images: {
            deleteMany: {},
            create: images,
          },
        }),
        ...(amenityIds && {
          amenities: {
            deleteMany: {},
            create: amenityIds.map((amenityId) => ({
              amenity: { connect: { id: amenityId } },
            })),
          },
        }),
      },
      include: {
        images: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.property.delete({ where: { id } });
  }

  async getFeatured() {
    return this.prisma.property.findMany({
      where: {
        featured: true,
        isActive: true,
      },
      include: {
        images: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 6,
    });
  }
}
