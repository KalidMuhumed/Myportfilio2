import { stadhjalpenTenant } from "@/chat-widget/tenants/stadhjalpen";
import type { TenantConfig, TenantId } from "@/chat-widget/types";

const tenants: Record<TenantId, TenantConfig> = {
  stadhjalpen: stadhjalpenTenant,
};

export function getTenant(id: TenantId): TenantConfig {
  const tenant = tenants[id];
  if (!tenant) {
    throw new Error(`Unknown tenant: ${id}`);
  }
  return tenant;
}
