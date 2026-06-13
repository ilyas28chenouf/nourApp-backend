import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProgressionService } from '../../../usecases-proxy/progression/progression.service';
import type { UserModel } from '../../../domain/users/model/user.model';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import { ProgressionResponseDto } from '../dto/response/progression.response.dto';

@ApiTags('Progression')
@ApiBearerAuth()
@ProtectedApi()
@Controller('progression')
export class ProgressionController {
  constructor(private readonly progression: ProgressionService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user Hasanats progression' })
  @ApiOkResponse({ type: ProgressionResponseDto })
  me(@CurrentUser() user: UserModel) {
    return this.progression.getUserProgression(user.id);
  }
}
