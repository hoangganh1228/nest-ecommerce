import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AllowPermissionDto } from './dto/allow-permission.dto';

@Controller('/api/v1/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  allow(@Body() requestBody: AllowPermissionDto) {
    return this.permissionsService.allow(requestBody);
  }
}
