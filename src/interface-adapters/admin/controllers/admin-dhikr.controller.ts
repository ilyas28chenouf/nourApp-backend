import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '../../../domain/users/enums/user-role.enum';
import { DhikrUsecasesProxyService } from '../../../usecases-proxy/dhikr/dhikr-usecases-proxy.service';
import { CreateDhikrCategoryRequestDto } from '../../dhikr/dto/request/create-dhikr-category.request.dto';
import { CreateDhikrItemRequestDto } from '../../dhikr/dto/request/create-dhikr-item.request.dto';
import { UpdateDhikrCategoryRequestDto } from '../../dhikr/dto/request/update-dhikr-category.request.dto';
import { UpdateDhikrItemRequestDto } from '../../dhikr/dto/request/update-dhikr-item.request.dto';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';

@ApiTags('Admin dhikr')
@ApiBearerAuth()
@ProtectedApi()
@Roles(UserRole.ADMIN)
@Controller('admin/dhikr')
export class AdminDhikrController {
  constructor(private readonly proxy: DhikrUsecasesProxyService) {}

  @Post('categories')
  @ApiOperation({ summary: 'Create dhikr category' })
  @ApiBody({ type: CreateDhikrCategoryRequestDto })
  @ApiOkResponse({ description: 'Dhikr category' })
  createCategory(@Body() dto: CreateDhikrCategoryRequestDto) {
    return this.proxy.createCategory(dto);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update dhikr category' })
  @ApiBody({ type: UpdateDhikrCategoryRequestDto })
  @ApiOkResponse({ description: 'Dhikr category' })
  updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateDhikrCategoryRequestDto,
  ) {
    return this.proxy.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete dhikr category' })
  @ApiOkResponse({ description: 'Deleted' })
  deleteCategory(@Param('id') id: string) {
    return this.proxy.deleteCategory(id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Create dhikr item' })
  @ApiBody({ type: CreateDhikrItemRequestDto })
  @ApiOkResponse({ description: 'Dhikr item' })
  createItem(@Body() dto: CreateDhikrItemRequestDto) {
    return this.proxy.createItem(dto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update dhikr item' })
  @ApiBody({ type: UpdateDhikrItemRequestDto })
  @ApiOkResponse({ description: 'Dhikr item' })
  updateItem(@Param('id') id: string, @Body() dto: UpdateDhikrItemRequestDto) {
    return this.proxy.updateItem(id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete dhikr item' })
  @ApiOkResponse({ description: 'Deleted' })
  deleteItem(@Param('id') id: string) {
    return this.proxy.deleteItem(id);
  }
}
