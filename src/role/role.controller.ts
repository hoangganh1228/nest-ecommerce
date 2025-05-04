import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { TransformDTO } from 'src/cores/interceptors/transform-dto.interceptors';
import { ResponseRoleDTO } from './dto/response-role.dto';

@Controller('api/v1/roles')
@TransformDTO(ResponseRoleDTO)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.roleService.getRole(name);
  }

  @Patch(':name')
  update(@Param('name') name: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(name, updateRoleDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.roleService.remove(name);
  }
}
