import { logger } from '../index';

/** 方法调用埋点装饰器（用于 class 方法） */
export function logMethod(target: unknown, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    logger.event(`method:${propertyKey}`, { args: args.length });
    return original.apply(this, args);
  };
  return descriptor;
}