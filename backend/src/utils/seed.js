require('dotenv').config();
const connectDb = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');

const categories = [
  { nameEn: 'Nature & Hiking', nameHe: 'טבע ומסלולים', slug: 'nature-hiking' },
  { nameEn: 'Waterfalls & Springs', nameHe: 'מפלים ומעיינות', slug: 'waterfalls-springs' },
  { nameEn: 'Restaurants & Cafés', nameHe: 'מסעדות ובתי קפה', slug: 'restaurants-cafes' },
  { nameEn: 'Wineries', nameHe: 'יקבים', slug: 'wineries' },
  { nameEn: 'Adventure Activities', nameHe: 'אטרקציות אתגריות', slug: 'adventure-activities' },
  { nameEn: 'Historical Sites', nameHe: 'אתרים היסטוריים', slug: 'historical-sites' }
];

const run = async () => {
  await connectDb();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@golan.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'StrongPassword123!';

  const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
  if (!existingAdmin) {
    await User.create({
      name: 'Site Admin',
      email: adminEmail,
      password: adminPassword
    });
    console.log('Admin user created');
  }

  for (const category of categories) {
    await Category.findOneAndUpdate({ slug: category.slug }, category, {
      upsert: true,
      new: true
    });
  }
  console.log('Categories seeded');

  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
