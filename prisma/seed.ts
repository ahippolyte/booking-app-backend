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
  const riadMarisol = await prisma.property.create({
    data: {
      slug: 'riad-marisol-medina',
      title: 'Riad Marisol Médina',
      description: 'Bienvenue à Marisol, un Riad entièrement privatisé rien que pour vous, niché au cœur de la kasbah. Ce riad dispose de 3 chambres confortables avec salles de bains privatives, une piscine rafraîchissante et une terrasse ombragée. Pendant votre séjour, laissez-vous choyer par Wafa qui prépare chaque matin de délicieux petits déjeuners marocains, assure un ménage quotidien et sur demande, cuisine des plats marocains savoureux. Nous organisons excursions et activités pour découvrir Marrakech.',
      type: 'RIAD',
      pricePerNight: 280,
      bedrooms: 3,
      bathrooms: 3,
      guests: 6,
      address: 'Kasbah, Médina',
      city: 'Marrakech',
      country: 'Morocco',
      latitude: 31.6211,
      longitude: -7.9897,
      featured: true,
      images: {
        create: [
          {
            url: '/images/properties/riad-marisol-medina-main.jpg',
            alt: 'Vue du patio principal du Riad',
            isMain: true,
          },
          {
            url: '/images/properties/riad-marisol-medina-chambre1.jpg',
            alt: 'Première chambre du Riad',
            isMain: false,
          },
          {
            url: '/images/properties/riad-marisol-medina-chambre2.jpg',
            alt: 'Deuxième chambre du Riad',
            isMain: false,
          },
          {
            url: '/images/properties/riad-marisol-medina-chambre3.jpg',
            alt: 'Troisième chambre du Riad',
            isMain: false,
          },
          {
            url: '/images/properties/riad-marisol-medina-terrasse.jpg',
            alt: 'Terrasse du Riad',
            isMain: false,
          }
        ],
      },
      amenities: {
        create: [
          { amenity: { connect: { name: 'WiFi' } } },
          { amenity: { connect: { name: 'Piscine' } } },
          { amenity: { connect: { name: 'Climatisation' } } },
          { amenity: { connect: { name: 'Cuisine équipée' } } },
          { amenity: { connect: { name: 'Terrasse' } } },
          { amenity: { connect: { name: 'Chef privé' } } },
          { amenity: { connect: { name: 'Ménage quotidien' } } },
          { amenity: { connect: { name: 'Transfert aéroport' } } },
        ],
      },
    },
  });
  console.log('✅ Property created:', riadMarisol.title);

  const appartementGueliz = await prisma.property.create({
    data: {
      slug: 'appartement-dyafa-gueliz',
      title: 'Appartement Dyafa Guéliz',
      description: 'Appartement spacieux et élégant en plein centre du quartier moderne de Guéliz. Proche de tous les commerces, restaurants et attractions. Idéal pour découvrir Marrakech moderne tout en profitant d\'un confort optimal.',
      type: 'APARTMENT',
      pricePerNight: 150,
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
      address: 'Avenue Mohamed V, Guéliz',
      city: 'Marrakech',
      featured: true,
      country: 'Morocco',
      latitude: 31.6369,
      longitude: -8.0089,
      images: {
        create: [
          {
            url: '/images/properties/apt-dyafa-gueliz-main.jpg',
            alt: 'Salon moderne de l\'appartement',
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

  const douiria = await prisma.property.create({
    data: {
      slug: 'douiria-prinssa-medina',
      title: 'Douiria Prinssa Médina',
      description: 'Charmante douiria traditionnelle marocaine située dans la médina historique de Marrakech. Cette petite maison de charme offre une expérience authentique avec son architecture typique, ses zellige et ses boiseries sculptées. Parfaite pour un couple ou une petite famille recherchant intimité et authenticité.',
      type: 'RIAD',
      pricePerNight: 200,
      bedrooms: 2,
      bathrooms: 2,
      guests: 4,
      address: 'Derb Sidi Bouloukat, Médina',
      city: 'Marrakech',
      featured: false,
      country: 'Morocco',
      latitude: 31.6258,
      longitude: -7.9891,
      images: {
        create: [
          {
            url: '/images/properties/riad-prinssa-medina-main.jpg',
            alt: 'Intérieur de la Douiria',
            isMain: true,
          },
        ],
      },
      amenities: {
        create: [
          { amenity: { connect: { name: 'WiFi' } } },
          { amenity: { connect: { name: 'Climatisation' } } },
          { amenity: { connect: { name: 'Cuisine équipée' } } },
          { amenity: { connect: { name: 'Terrasse' } } },
        ],
      },
    },
  });
  console.log('✅ Property created:', douiria.title);

  // Create a sample booking
  const booking = await prisma.booking.create({
    data: {
      userId: customer.id,
      propertyId: riadMarisol.id,
      checkIn: new Date('2025-12-24'),
      checkOut: new Date('2025-12-31'),
      guests: 4,
      totalPrice: 1960, // 7 nights * 280€
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
      propertyId: riadMarisol.id,
      rating: 5,
      comment: 'Séjour exceptionnel au Riad Marisol ! Wafa nous a préparé des petits déjeuners délicieux chaque matin. La piscine et la terrasse sont magnifiques. L\'emplacement dans la kasbah est parfait pour découvrir la médina.',
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
