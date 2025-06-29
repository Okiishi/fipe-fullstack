const sequelize = require("./config/database");
const User = require("./models/User");
const Vehicle = require("./models/Vehicle");

User.hasMany(Vehicle, { foreignKey: "userId", as: "vehicles" });
Vehicle.belongsTo(User, { foreignKey: "userId", as: "user" });

const vehiclesData = [
  { brand: "Fiat", model: "Mobi", year: 2023, value: "R$ 69.990,00" },
  { brand: "Fiat", model: "Argo", year: 2023, value: "R$ 79.790,00" },
  { brand: "Fiat", model: "Cronos", year: 2024, value: "R$ 92.990,00" },
  { brand: "Fiat", model: "Pulse", year: 2024, value: "R$ 102.990,00" },
  { brand: "Fiat", model: "Toro", year: 2023, value: "R$ 146.990,00" },
  { brand: "Fiat", model: "Strada", year: 2024, value: "R$ 100.990,00" },
  { brand: "Fiat", model: "Fastback", year: 2024, value: "R$ 119.990,00" },
  { brand: "Fiat", model: "Uno", year: 2021, value: "R$ 55.000,00" },
  { brand: "Fiat", model: "Palio", year: 2017, value: "R$ 42.000,00" },
  { brand: "Fiat", model: "Siena", year: 2018, value: "R$ 48.000,00" },

  { brand: "Volkswagen", model: "Polo", year: 2023, value: "R$ 86.390,00" },
  { brand: "Volkswagen", model: "Nivus", year: 2024, value: "R$ 130.890,00" },
  { brand: "Volkswagen", model: "T-Cross", year: 2024, value: "R$ 136.990,00" },
  { brand: "Volkswagen", model: "Taos", year: 2023, value: "R$ 181.380,00" },
  { brand: "Volkswagen", model: "Amarok", year: 2023, value: "R$ 294.980,00" },
  { brand: "Volkswagen", model: "Gol", year: 2022, value: "R$ 74.150,00" },
  { brand: "Volkswagen", model: "Voyage", year: 2022, value: "R$ 85.770,00" },
  { brand: "Volkswagen", model: "Virtus", year: 2024, value: "R$ 106.990,00" },
  { brand: "Volkswagen", model: "Jetta", year: 2023, value: "R$ 226.990,00" },
  { brand: "Volkswagen", model: "Saveiro", year: 2024, value: "R$ 95.770,00" },

  { brand: "Chevrolet", model: "Onix", year: 2024, value: "R$ 84.390,00" },
  { brand: "Chevrolet", model: "Onix Plus", year: 2024, value: "R$ 96.390,00" },
  { brand: "Chevrolet", model: "Tracker", year: 2024, value: "R$ 130.920,00" },
  { brand: "Chevrolet", model: "Montana", year: 2024, value: "R$ 140.490,00" },
  { brand: "Chevrolet", model: "S10", year: 2023, value: "R$ 247.850,00" },
  { brand: "Chevrolet", model: "Cruze", year: 2023, value: "R$ 162.590,00" },
  { brand: "Chevrolet", model: "Spin", year: 2024, value: "R$ 103.990,00" },
  { brand: "Chevrolet", model: "Equinox", year: 2023, value: "R$ 215.770,00" },
  { brand: "Chevrolet", model: "Celta", year: 2016, value: "R$ 34.000,00" },
  { brand: "Chevrolet", model: "Prisma", year: 2019, value: "R$ 68.000,00" },

  { brand: "Hyundai", model: "HB20", year: 2024, value: "R$ 82.290,00" },
  { brand: "Hyundai", model: "Creta", year: 2024, value: "R$ 135.390,00" },
  { brand: "Hyundai", model: "HB20S", year: 2024, value: "R$ 91.890,00" },
  { brand: "Hyundai", model: "Tucson", year: 2018, value: "R$ 105.000,00" },
  { brand: "Hyundai", model: "ix35", year: 2021, value: "R$ 125.000,00" },
  { brand: "Hyundai", model: "Azera", year: 2020, value: "R$ 210.000,00" },
  { brand: "Hyundai", model: "Santa Fe", year: 2019, value: "R$ 195.000,00" },
  { brand: "Hyundai", model: "Elantra", year: 2018, value: "R$ 95.000,00" },
  { brand: "Hyundai", model: "i30", year: 2016, value: "R$ 78.000,00" },
  { brand: "Hyundai", model: "Veloster", year: 2013, value: "R$ 65.000,00" },

  { brand: "Toyota", model: "Corolla", year: 2024, value: "R$ 148.990,00" },
  {
    brand: "Toyota",
    model: "Corolla Cross",
    year: 2024,
    value: "R$ 162.590,00",
  },
  { brand: "Toyota", model: "Hilux", year: 2023, value: "R$ 242.590,00" },
  { brand: "Toyota", model: "Yaris", year: 2024, value: "R$ 97.990,00" },
  { brand: "Toyota", model: "SW4", year: 2023, value: "R$ 376.190,00" },
  { brand: "Toyota", model: "RAV4", year: 2022, value: "R$ 290.000,00" },
  { brand: "Toyota", model: "Etios", year: 2021, value: "R$ 65.000,00" },
  { brand: "Toyota", model: "Yaris Sedan", year: 2024, value: "R$ 99.990,00" },
  { brand: "Toyota", model: "Prius", year: 2021, value: "R$ 170.000,00" },
  { brand: "Toyota", model: "Camry", year: 2020, value: "R$ 280.000,00" },

  { brand: "Honda", model: "Civic", year: 2024, value: "R$ 265.900,00" },
  { brand: "Honda", model: "HR-V", year: 2024, value: "R$ 151.200,00" },
  { brand: "Honda", model: "City", year: 2024, value: "R$ 118.700,00" },
  {
    brand: "Honda",
    model: "City Hatchback",
    year: 2024,
    value: "R$ 117.500,00",
  },
  { brand: "Honda", model: "Fit", year: 2021, value: "R$ 90.000,00" },
  { brand: "Honda", model: "WR-V", year: 2021, value: "R$ 95.000,00" },
  { brand: "Honda", model: "CR-V", year: 2022, value: "R$ 230.000,00" },
  { brand: "Honda", model: "Accord", year: 2021, value: "R$ 260.000,00" },
  { brand: "Honda", model: "Civic Si", year: 2020, value: "R$ 180.000,00" },
  { brand: "Honda", model: "Fit Personal", year: 2020, value: "R$ 82.000,00" },

  { brand: "Renault", model: "Kwid", year: 2024, value: "R$ 72.640,00" },
  { brand: "Renault", model: "Duster", year: 2024, value: "R$ 118.690,00" },
  { brand: "Renault", model: "Sandero", year: 2022, value: "R$ 80.000,00" },
  { brand: "Renault", model: "Logan", year: 2022, value: "R$ 83.000,00" },
  { brand: "Renault", model: "Captur", year: 2023, value: "R$ 140.000,00" },
  { brand: "Renault", model: "Oroch", year: 2024, value: "R$ 115.900,00" },
  { brand: "Renault", model: "Zoe E-Tech", year: 2023, value: "R$ 239.990,00" },
  {
    brand: "Renault",
    model: "Kwid E-Tech",
    year: 2024,
    value: "R$ 149.990,00",
  },
  { brand: "Renault", model: "Clio", year: 2016, value: "R$ 38.000,00" },
  { brand: "Renault", model: "Fluence", year: 2018, value: "R$ 70.000,00" },

  { brand: "Jeep", model: "Renegade", year: 2024, value: "R$ 134.190,00" },
  { brand: "Jeep", model: "Compass", year: 2024, value: "R$ 180.390,00" },
  { brand: "Jeep", model: "Commander", year: 2024, value: "R$ 234.590,00" },
  { brand: "Jeep", model: "Wrangler", year: 2023, value: "R$ 456.990,00" },
  { brand: "Jeep", model: "Gladiator", year: 2023, value: "R$ 499.990,00" },
  { brand: "Jeep", model: "Cherokee", year: 2015, value: "R$ 130.000,00" },
  {
    brand: "Jeep",
    model: "Grand Cherokee",
    year: 2021,
    value: "R$ 350.000,00",
  },
  { brand: "Jeep", model: "Compass 4xe", year: 2023, value: "R$ 347.300,00" },
  {
    brand: "Jeep",
    model: "Renegade Sport",
    year: 2022,
    value: "R$ 125.000,00",
  },
  {
    brand: "Jeep",
    model: "Compass Longitude",
    year: 2022,
    value: "R$ 170.000,00",
  },

  { brand: "Ford", model: "Ranger", year: 2024, value: "R$ 239.990,00" },
  { brand: "Ford", model: "Territory", year: 2024, value: "R$ 209.990,00" },
  { brand: "Ford", model: "Bronco Sport", year: 2023, value: "R$ 272.790,00" },
  { brand: "Ford", model: "Maverick", year: 2023, value: "R$ 240.490,00" },
  { brand: "Ford", model: "Mustang", year: 2023, value: "R$ 576.490,00" },
  { brand: "Ford", model: "Ka", year: 2021, value: "R$ 60.000,00" },
  { brand: "Ford", model: "Ka Sedan", year: 2021, value: "R$ 65.000,00" },
  { brand: "Ford", model: "EcoSport", year: 2021, value: "R$ 90.000,00" },
  { brand: "Ford", model: "Fiesta", year: 2019, value: "R$ 55.000,00" },
  { brand: "Ford", model: "Focus", year: 2019, value: "R$ 75.000,00" },

  { brand: "Nissan", model: "Kicks", year: 2024, value: "R$ 112.990,00" },
  { brand: "Nissan", model: "Versa", year: 2024, value: "R$ 107.490,00" },
  { brand: "Nissan", model: "Frontier", year: 2024, value: "R$ 242.490,00" },
  { brand: "Nissan", model: "Leaf", year: 2023, value: "R$ 293.790,00" },
  { brand: "Nissan", model: "March", year: 2020, value: "R$ 52.000,00" },
  { brand: "Nissan", model: "Sentra", year: 2023, value: "R$ 148.490,00" },
  { brand: "Nissan", model: "Tiida", year: 2013, value: "R$ 35.000,00" },
  { brand: "Nissan", model: "Livina", year: 2014, value: "R$ 40.000,00" },
  { brand: "Nissan", model: "Grand Livina", year: 2014, value: "R$ 42.000,00" },
  { brand: "Nissan", model: "Pathfinder", year: 2008, value: "R$ 65.000,00" },
];

const seedDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Banco de dados sincronizado.");

    let adminUser = await User.findOne({ where: { email: "admin@admin.com" } });

    if (!adminUser) {
      console.log("Usuário admin não encontrado, criando um novo...");
      adminUser = await User.create({
        email: "admin@admin.com",
        password: "password",
      });
      console.log("Usuário admin de teste criado com sucesso!");
    } else {
      console.log("Usuário admin de teste já existe.");
    }

    const vehiclesWithOwner = vehiclesData.map((vehicle) => ({
      ...vehicle,
      userId: adminUser.id,
    }));

    const existingVehicles = await Vehicle.findAll({
      where: { userId: adminUser.id },
      attributes: ["brand", "model", "year"],
    });

    const existingSet = new Set(
      existingVehicles.map((v) => `${v.brand}-${v.model}-${v.year}`)
    );

    const vehiclesToCreate = vehiclesWithOwner.filter(
      (v) => !existingSet.has(`${v.brand}-${v.model}-${v.year}`)
    );

    if (vehiclesToCreate.length > 0) {
      await Vehicle.bulkCreate(vehiclesToCreate);
      console.log(
        `${vehiclesToCreate.length} novos veículos foram inseridos com sucesso!`
      );
    } else {
      console.log(
        "Nenhum veículo novo para inserir. O banco de dados já está populado com estes dados."
      );
    }
  } catch (error) {
    console.error("Erro ao popular o banco de dados:", error);
  } finally {
    await sequelize.close();
    console.log("Conexão com o banco de dados fechada.");
  }
};

seedDatabase();
