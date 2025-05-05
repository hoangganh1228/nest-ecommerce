import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { EndpointService } from './endpoint.service';
import { MetadataScanner } from '@nestjs/core';
import { getEndpoints } from '../utils/app.util';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { CreateEndpointDto } from './dto/create-endpoint.dto';

@Controller('/api/v1/endpoints')
export class EndpointController {
  constructor(
    private readonly endpointService: EndpointService,
    private readonly reflector: Reflector,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}
  @Get('/all')
  getAllEndpoints() {
    const routes = getEndpoints(
      this.discoveryService,
      this.metadataScanner,
      this.reflector,
    );
    return { routes };
  }

  @Post()
  create(@Body() createEndpointDto: CreateEndpointDto) {
    return this.endpointService.create(createEndpointDto);
  }
}
