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
        createdAt: 'asc', // Le premier créé apparaît en premier
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

    // Générer le slug automatiquement si non fourni
    if (!propertyData.slug) {
      propertyData.slug = this.generateSlug(propertyData.title);
    }

    // Utiliser maxGuests au lieu de guests si fourni
    if ((data as any).maxGuests && !propertyData.guests) {
      propertyData.guests = (data as any).maxGuests;
    }

    // Gérer les amenities depuis le frontend (tableau d'objets avec name)
    const amenitiesFromFrontend = (data as any).amenities;
    let amenityConnections = [];

    if (amenitiesFromFrontend && Array.isArray(amenitiesFromFrontend)) {
      // Créer ou récupérer les amenities
      for (const amenityData of amenitiesFromFrontend) {
        const amenityName = amenityData.name || amenityData;
        
        // Vérifier si l'amenity existe déjà
        let amenity = await this.prisma.amenity.findFirst({
          where: { name: amenityName }
        });

        // Si non, la créer
        if (!amenity) {
          amenity = await this.prisma.amenity.create({
            data: {
              name: amenityName,
              icon: '✓', // Icône par défaut
            }
          });
        }

        amenityConnections.push({
          amenity: { connect: { id: amenity.id } }
        });
      }
    } else if (amenityIds && amenityIds.length > 0) {
      // Support de l'ancien format avec IDs
      amenityConnections = amenityIds.map((amenityId) => ({
        amenity: { connect: { id: amenityId } },
      }));
    }

    return this.prisma.property.create({
      data: {
        ...propertyData,
        images: {
          create: images,
        },
        amenities: {
          create: amenityConnections,
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

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
      .trim()
      .replace(/\s+/g, '-') // Remplacer espaces par tirets
      .replace(/-+/g, '-'); // Éviter les tirets multiples
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
      orderBy: {
        createdAt: 'asc', // Le premier créé apparaît en premier
      },
      take: 6,
    });
  }
}
