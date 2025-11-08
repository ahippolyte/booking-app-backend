import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@conciergerie-marrakech.com' },
    update: {},
    create: {
      email: 'admin@conciergerie-marrakech.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Conciergerie',
      phone: '+212 5 24 00 00 00',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test customer
  const customerPassword = await bcrypt.hash('Customer123!', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      password: customerPassword,
      firstName: 'Mohamed',
      lastName: 'Alaoui',
      phone: '+212 6 12 34 56 78',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Customer user created:', customer.email);

  // Create amenities
  const amenities = [
    { name: 'WiFi', icon: 'wifi', description: 'High-speed wireless internet' },
    { name: 'Piscine', icon: 'pool', description: 'Private swimming pool' },
    { name: 'Climatisation', icon: 'ac', description: 'Air conditioning' },
    { name: 'Cuisine équipée', icon: 'kitchen', description: 'Fully equipped kitchen' },
    { name: 'Parking', icon: 'parking', description: 'Private parking space' },
    { name: 'Terrasse', icon: 'terrace', description: 'Private terrace' },
    { name: 'Jardin', icon: 'garden', description: 'Private garden' },
    { name: 'Hammam', icon: 'hammam', description: 'Traditional Moroccan steam bath' },
    { name: 'Majordome', icon: 'concierge', description: '24/7 butler service' },
    { name: 'Chef privé', icon: 'chef', description: 'Private chef available' },
    { name: 'Transfert aéroport', icon: 'airport', description: 'Airport transfer service' },
    { name: 'Ménage quotidien', icon: 'cleaning', description: 'Daily housekeeping' },
  ];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity,
    });
  }
  console.log(`✅ ${amenities.length} amenities created`);

  // Create properties
  const riadLuxe = await prisma.property.create({
    data: {
      slug: 'riad-luxe-medina',
      title: 'Riad Luxe Médina',
      description: 'Magnifique riad traditionnel situé au cœur de la médina de Marrakech. Entièrement rénové avec un mélange harmonieux de style marocain authentique et de confort moderne.',
      type: 'RIAD',
      pricePerNight: 350,
      bedrooms: 5,
      bathrooms: 5,
      guests: 10,
      address: 'Derb Arset Aouzal, Médina',
      city: 'Marrakech',
      country: 'Morocco',
      latitude: 31.6295,
      longitude: -7.9811,
      images: {
        create: [
          {
            url: '/images/properties/riad-luxe-1.jpg',
            alt: 'Patio principal du riad',
            isMain: true,
          },
          {
            url: '/images/properties/riad-luxe-2.jpg',
            alt: 'Suite principale',
            isMain: false,
          },
          {
            url: '/images/properties/riad-luxe-3.jpg',
            alt: 'Terrasse sur le toit',
            isMain: false,
          },
        ],
      },
      amenities: {
        create: [
          { amenity: { connect: { name: 'WiFi' } } },
          { amenity: { connect: { name: 'Piscine' } } },
          { amenity: { connect: { name: 'Climatisation' } } },
          { amenity: { connect: { name: 'Cuisine équipée' } } },
          { amenity: { connect: { name: 'Terrasse' } } },
          { amenity: { connect: { name: 'Hammam' } } },
          { amenity: { connect: { name: 'Majordome' } } },
          { amenity: { connect: { name: 'Ménage quotidien' } } },
        ],
      },
    },
  });
  console.log('✅ Property created:', riadLuxe.title);

  const villaModerne = await prisma.property.create({
    data: {
      slug: 'villa-moderne-palmeraie',
      title: 'Villa Moderne Palmeraie',
      description: 'Superbe villa contemporaine située dans la palmeraie de Marrakech, offrant une vue imprenable sur l\'Atlas. Design moderne avec équipements haut de gamme.',
      type: 'VILLA',
      pricePerNight: 500,
      bedrooms: 6,
      bathrooms: 6,
      guests: 12,
      address: 'Route de Fès, Palmeraie',
      city: 'Marrakech',
      country: 'Morocco',
      latitude: 31.6692,
      longitude: -7.9367,
      images: {
        create: [
          {
            url: '/images/properties/villa-moderne-1.jpg',
            alt: 'Façade de la villa',
            isMain: true,
          },
          {
            url: '/images/properties/villa-moderne-2.jpg',
            alt: 'Piscine à débordement',
            isMain: false,
          },
        ],
      },
      amenities: {
        create: [
          { amenity: { connect: { name: 'WiFi' } } },
          { amenity: { connect: { name: 'Piscine' } } },
          { amenity: { connect: { name: 'Climatisation' } } },
          { amenity: { connect: { name: 'Cuisine équipée' } } },
          { amenity: { connect: { name: 'Parking' } } },
          { amenity: { connect: { name: 'Jardin' } } },
          { amenity: { connect: { name: 'Chef privé' } } },
          { amenity: { connect: { name: 'Transfert aéroport' } } },
        ],
      },
    },
  });
  console.log('✅ Property created:', villaModerne.title);

  const appartementGueliz = await prisma.property.create({
    data: {
      slug: 'appartement-centre-gueliz',
      title: 'Appartement Centre Guéliz',
      description: 'Appartement spacieux et élégant en plein centre du quartier moderne de Guéliz. Proche de tous les commerces, restaurants et attractions.',
      type: 'APARTMENT',
      pricePerNight: 150,
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
      address: 'Avenue Mohamed V, Guéliz',
      city: 'Marrakech',
      country: 'Morocco',
      latitude: 31.6369,
      longitude: -8.0089,
      images: {
        create: [
          {
            url: '/images/properties/appt-gueliz-1.jpg',
            alt: 'Salon moderne',
            isMain: true,
          },
        ],
      },
      amenities: {
        create: [
          { amenity: { connect: { name: 'WiFi' } } },
          { amenity: { connect: { name: 'Climatisation' } } },
          { amenity: { connect: { name: 'Cuisine équipée' } } },
          { amenity: { connect: { name: 'Parking' } } },
        ],
      },
    },
  });
  console.log('✅ Property created:', appartementGueliz.title);

  // Create a sample booking
  const booking = await prisma.booking.create({
    data: {
      userId: customer.id,
      propertyId: riadLuxe.id,
      checkIn: new Date('2024-07-15'),
      checkOut: new Date('2024-07-22'),
      guests: 8,
      totalPrice: 2450, // 7 nights * 350€
      status: 'CONFIRMED',
      guestFirstName: customer.firstName,
      guestLastName: customer.lastName,
      guestEmail: customer.email,
      guestPhone: customer.phone,
    },
  });
  console.log('✅ Sample booking created');

  // Create a review
  await prisma.review.create({
    data: {
      userId: customer.id,
      propertyId: riadLuxe.id,
      rating: 5,
      comment: 'Séjour exceptionnel dans ce magnifique riad. Le personnel est aux petits soins et l\'emplacement est parfait pour découvrir la médina.',
    },
  });
  console.log('✅ Sample review created');

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('👤 Admin credentials:');
  console.log('   Email: admin@conciergerie-marrakech.com');
  console.log('   Password: Admin123!');
  console.log('');
  console.log('👤 Customer credentials:');
  console.log('   Email: client@example.com');
  console.log('   Password: Customer123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
