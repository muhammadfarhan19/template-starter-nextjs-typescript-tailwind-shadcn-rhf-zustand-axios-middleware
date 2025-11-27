import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.student.deleteMany(); // bersihkan data sebelumnya

  await prisma.student.createMany({
    data: [
      {
        name: "Ahmad Fauzi",
        gender: "MALE",
        address: "Jl. Kaliurang KM 7, Yogyakarta",
        phoneNumber: "081234567890",
        fatherName: "Slamet Riyadi",
        motherName: "Siti Nurhaliza",
        grade: "1",
        status: "APPROVED",
      },
      {
        name: "Putri Ayu",
        gender: "FEMALE",
        address: "Jl. Affandi No. 12, Yogyakarta",
        phoneNumber: "081987654321",
        fatherName: "Budi Santoso",
        motherName: "Dewi Lestari",
        grade: "2",
        status: "APPROVED",
      },
      {
        name: "Rizky Hidayat",
        gender: "MALE",
        address: "Jl. Magelang KM 5, Sleman",
        phoneNumber: "081223344556",
        fatherName: "Hendri Saputra",
        motherName: "Nur Aisyah",
        grade: "3",
        status: "APPROVED",
      },
      {
        name: "Salsabila Rahma",
        gender: "FEMALE",
        address: "Jl. Wonosari KM 10, Bantul",
        phoneNumber: "081334455667",
        fatherName: "Agus Priyono",
        motherName: "Lina Marlina",
        grade: "1",
        status: "PENDING",
      },
      {
        name: "Dimas Aditya",
        gender: "MALE",
        address: "Jl. Parangtritis No. 25, Bantul",
        phoneNumber: "081556677889",
        fatherName: "Sutrisno",
        motherName: "Indah Kartika",
        grade: "2",
        status: "APPROVED",
      },
    ],
  });

  console.log("✅ Seeder student berhasil dijalankan!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
