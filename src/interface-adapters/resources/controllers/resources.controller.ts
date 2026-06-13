import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../../domain/users/enums/user-role.enum';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import type { UserModel } from '../../../domain/users/model/user.model';
import { ResourcesUsecasesProxyService } from '../../../usecases-proxy/resources/resources-usecases-proxy.service';
import { ResourceResponseDto } from '../dto/response/resource.response.dto';
import { ResourceResponseMapper } from '../mappers/resource.response.mapper';
@ApiTags('Resources')
@ApiBearerAuth()
@ProtectedApi()
@Controller('resources')
export class ResourcesController {
  constructor(private readonly proxy: ResourcesUsecasesProxyService) {}
  @Get()
  @ApiOperation({ summary: 'Get resources' })
  @ApiOkResponse({ type: [ResourceResponseDto] })
  list() {
    return ResourceResponseMapper.toDto(this.proxy.list());
  }
  @Get('daily')
  @ApiOperation({ summary: 'Get verse, hadith and wisdom of the day' })
  @ApiOkResponse({ description: 'Daily resources' })
  daily() {
    return ResourceResponseMapper.toDto(this.proxy.daily());
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get resource by id' })
  @ApiOkResponse({ type: ResourceResponseDto })
  get(@Param('id') id: string) {
    return ResourceResponseMapper.toDto(this.proxy.get(id));
  }
}
