import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { AuthUsecasesProxyService } from '../../../usecases-proxy/auth/auth-usecases-proxy.service';
import { AuthUserResponseDto } from '../dto/response/auth-user.response.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@ProtectedApi()
@Controller('auth')
export class AuthController {
  constructor(private readonly proxy: AuthUsecasesProxyService) {}
  @Get('me') @ApiOperation({ summary: 'Get current authenticated user' }) @ApiResponse({ type: AuthUserResponseDto }) me(@CurrentUser() user: UserModel) { return this.proxy.getCurrentUser(user); }
  @Post('sync-firebase-user') @ApiOperation({ summary: 'Synchronize Firebase user with local database' }) @ApiResponse({ type: AuthUserResponseDto }) sync(@CurrentUser() user: UserModel) { return this.proxy.getCurrentUser(user); }
}
