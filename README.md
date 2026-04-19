# MedFlow MVP

Starter full-stack para prontuário médico com:
- autenticação JWT
- pacientes
- prontuário/anamnese
- prescrições
- solicitações de exames
- assinatura digital interna por hash
- PostgreSQL + Prisma
- frontend Next.js

## Aviso importante
Este projeto é um **MVP técnico**. Ele **não substitui** adequações jurídicas, certificação SBIS/CFM, ICP-Brasil, revisão de segurança, LGPD, trilha de auditoria completa e validações clínicas necessárias para produção.

## Estrutura
- `backend/`: API Node.js + Express + Prisma
- `frontend/`: interface Next.js

## Subir com Docker
### Banco
```bash
docker compose up -d
```

## Backend
```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Login inicial
Depois de rodar o seed:
- Email: `admin@medflow.com`
- Senha: `123456`

## Fluxo básico
1. Faça login.
2. Cadastre pacientes.
3. Crie prontuários com anamnese.
4. Gere prescrições e pedidos de exame.
5. Assine internamente o documento com hash.

## Próximos passos recomendados
- ICP-Brasil real
- controle de perfil por clínica/unidade
- PDFs formais com layout médico
- auditoria expandida
- anexos
- templates por especialidade
- logs de acesso por prontuário
