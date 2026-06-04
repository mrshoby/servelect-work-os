import { getDataProviderMode } from "./data-provider";
import { mockRepository } from "./repository.mock";
import { prismaRepository } from "./repository.prisma";

export const repository = new Proxy({} as typeof mockRepository, {
  get(_target, prop: keyof typeof mockRepository) {
    const provider = getDataProviderMode() === "prisma" ? prismaRepository : mockRepository;
    const value = provider[prop as keyof typeof provider];
    return typeof value === "function" ? value.bind(provider) : value;
  }
});
