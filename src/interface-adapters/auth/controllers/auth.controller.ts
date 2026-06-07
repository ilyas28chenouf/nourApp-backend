import { Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import type { UserModel } from '../../../domain/users/model/user.model';
import { AuthUsecasesProxyService } from '../../../usecases-proxy/auth/auth-usecases-proxy.service';
import { AuthResponseMapper } from '../mappers/auth.response.mapper';

import { AuthUserResponseDto } from '../dto/response/auth-user.response.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@ProtectedApi()
@Controller('auth')
export class AuthController {
  constructor(private readonly proxy: AuthUsecasesProxyService) {}
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({ type: AuthUserResponseDto })
  me(@CurrentUser() user: UserModel) {
    return AuthResponseMapper.toDto(this.proxy.getCurrentUser(user));
  }
  @Post('sync-firebase-user')
  @ApiOperation({ summary: 'Synchronize Firebase user with local database' })
  @ApiOkResponse({ type: AuthUserResponseDto })
  sync(@CurrentUser() user: UserModel) {
    return AuthResponseMapper.toDto(this.proxy.getCurrentUser(user));
  }
}
