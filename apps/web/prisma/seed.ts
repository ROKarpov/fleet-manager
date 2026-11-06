import { PrismaClient } from '../src/generated/prisma/client.js'

import { getDatabaseUrl } from '../src/database-url.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing todos
  const testTanant = await prisma.tenant.create({
    data: {
      name: 'Test tenant'
    }
  })

  await prisma.operator.create({
    data: {
      username: 'test_operator',
      tenantId: testTanant.id
    }
  })

  const testFleet = await prisma.fleet.create({
    data: {
      name: 'Test fleet',
      tenantId: testTanant.id
    }
  })

  await prisma.robot.createManyAndReturn({
    data: [
      {
        name: 'Test robot 1',
        fleetId: testFleet.id
      },
      {
        name: 'Test robot 2',
        fleetId: testFleet.id
      },
      {
        name: 'Test robot 3',
        fleetId: testFleet.id
      }
    ]
  })

  console.log(`✅ Created test data`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
