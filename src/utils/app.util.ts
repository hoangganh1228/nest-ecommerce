import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common';

export function getEndpoints(
  discoveryService: DiscoveryService,
  metadataScanner: MetadataScanner,
  reflector: Reflector,
) {
  const controllers = discoveryService.getControllers();

  const routes = controllers.flatMap(({ instance, metatype }) => {
    if (!instance || !metatype) return [];

    const prototype = Object.getPrototypeOf(instance);
    const basePath = reflector.get(PATH_METADATA, metatype) || '';

    return metadataScanner
      .getAllMethodNames(prototype)
      .map((methodName) => {
        const methodRef = prototype[methodName];
        const routePath = reflector.get(PATH_METADATA, methodRef);
        const requestMethod = reflector.get(METHOD_METADATA, methodRef);

        if (routePath == null || requestMethod == null) return null;

        const methodStr = RequestMethod[requestMethod]; // Convert enum to string
        return `${methodStr} /api/v1/${basePath}/${routePath}`.replace(
          /\/+/g,
          '/',
        );
      })
      .filter((r) => !!r);
  });

  return routes;
}
