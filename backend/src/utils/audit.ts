import { prisma } from '../config/prisma.js';

export async function createAuditLog(params: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
}) {
  await prisma.auditLog.create({ data: params });
}
