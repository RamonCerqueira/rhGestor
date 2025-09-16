import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário administrador padrão
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@docgestor.com' },
    update: {},
    create: {
      email: 'admin@docgestor.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Criar usuário comum para testes
  const userPassword = await bcrypt.hash('user123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'user@docgestor.com' },
    update: {},
    create: {
      email: 'user@docgestor.com',
      name: 'Usuário Teste',
      password: userPassword,
      role: 'user',
    },
  });

  // Criar funcionários de exemplo
  const employee1 = await prisma.employee.upsert({
    where: { email: 'joao.silva@empresa.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      cpf: '12345678901',
      position: 'Desenvolvedor',
      department: 'TI',
      status: 'OK',
    },
  });

  const employee2 = await prisma.employee.upsert({
    where: { email: 'maria.santos@empresa.com' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      cpf: '98765432109',
      position: 'Analista de RH',
      department: 'Recursos Humanos',
      status: 'Pendente',
    },
  });

  const employee3 = await prisma.employee.upsert({
    where: { email: 'pedro.oliveira@empresa.com' },
    update: {},
    create: {
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@empresa.com',
      cpf: '11122233344',
      position: 'Gerente de Vendas',
      department: 'Vendas',
      status: 'Alerta',
    },
  });

  console.log('Seed executado com sucesso!');
  console.log('Usuários criados:', { admin, user });
  console.log('Funcionários criados:', { employee1, employee2, employee3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

