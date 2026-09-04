import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '../../../domain/users/enums/user-role.enum';
import { ProgressionService } from '../../../usecases-proxy/progression/progression.service';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';

@ApiTags('Admin progression')
@ApiBearerAuth()
@ProtectedApi()
@Roles(UserRole.ADMIN)
@Controller('admin/users')
export class AdminProgressionController {
  constructor(private readonly progression: ProgressionService) {}

  @Get(':id/progression')
  @ApiOperation({
    summary: 'Get user progression including combined-level catalog metadata',
  })
  @ApiOkResponse({ description: 'Progression with catalog metadata' })
  getUserProgression(@Param('id') id: string) {
    return this.progression.getUserProgression(id, true);
  }
}
