const ConnectDb = require("../../db");
const Specialization = require('../models/specialzation');

ConnectDb();

const specializationsData = [
  {
    name_en: 'Barbering',
    name_ar: 'حلاقة',
    description: 'Profession specializing in cutting, styling, and grooming hair.'
  },
  {
    name_en: 'Blacksmithing',
    name_ar: 'حدادة',
    description: 'Craft of forging and shaping metals, particularly iron and steel.'
  },
  {
    name_en: 'Carpentry',
    name_ar: 'نجارة',
    description: 'Craft of woodworking, including making furniture and wooden structures.'
  },
  {
    name_en: 'Plumbing',
    name_ar: 'سباكة',
    description: 'Installation and maintenance of systems used for drinking water, sewage, and drainage.'
  },
  {
    name_en: 'Electrician',
    name_ar: 'كهربائي',
    description: 'Installation and maintenance of electrical systems and appliances.'
  },
  {
    name_en: 'Painting',
    name_ar: 'دهان',
    description: 'Application of paint, color, and decoration to surfaces.'
  },
  {
    name_en: 'Tailoring',
    name_ar: 'خياطة',
    description: 'Sewing and crafting of garments and other textile products.'
  },
  {
    name_en: 'Cooking',
    name_ar: 'طبخ',
    description: 'Preparation of food through various culinary techniques.'
  },
  {
    name_en: 'Gardening',
    name_ar: 'بستنة',
    description: 'Cultivation and management of gardens, plants, and outdoor spaces.'
  },
  {
    name_en: 'Photography',
    name_ar: 'تصوير فوتوغرافي',
    description: 'Art and practice of creating durable images by recording light or other electromagnetic radiation.'
  }
];

async function seedSpecializations() {
  try {
    await Specialization.deleteMany();
    await Specialization.insertMany(specializationsData);
    console.log('Specializations seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding specializations:', error);
    process.exit(1);
  }
}

seedSpecializations();
