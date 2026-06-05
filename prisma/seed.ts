import { PrismaClient } from '@prisma/client';
import process from 'process';
// Nếu hệ thống của Khoa có dùng mã hóa mật khẩu bcrypt thì import vào, không thì để pass thô
// import bcrypt from 'bcrypt'; 

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang khởi tạo dữ liệu mẫu (Seeding)...');

  // Xóa dữ liệu cũ nếu có để tránh trùng lặp trùng email
  await prisma.user.deleteMany();

  // 1. Tạo tài khoản Admin mặc định
  // const hashedPassword = await bcrypt.hash('123456', 10); // dùng dòng này nếu có mã hóa pass

  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: '123456', // hoặc hashedPassword nếu có mã hóa
      fullName: 'Quản trị viên Khoa',
      role: 'ADMIN',
      phone: '0901234567',
    },
  });

  console.log(`🎉 Đã tạo thành công tài khoản Admin mặc định: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });