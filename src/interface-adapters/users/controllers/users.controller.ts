import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import type { UserModel } from '../../../domain/users/model/user.model';
import { UsersUsecasesProxyService } from '../../../usecases-proxy/users/users-usecases-proxy.service';
import { UpdateCurrentUserRequestDto } from '../dto/request/update-current-user.request.dto';
import { UpdateUserLocationRequestDto } from '../dto/request/update-user-location.request.dto';
import { UserResponseMapper } from '../mappers/user.response.mapper';
import { UserResponseDto } from '../dto/response/user.response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@ProtectedApi()
@Controller('users')
export class UsersController {
  constructor(private readonly proxy: UsersUsecasesProxyService) {}
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  async me(@CurrentUser() user: UserModel) {
    return UserResponseMapper.toDto(await this.proxy.getCurrentUser(user));
  }
  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateCurrentUserRequestDto })
  @ApiOkResponse({ type: UserResponseDto })
  async update(
    @CurrentUser() user: UserModel,
    @Body() dto: UpdateCurrentUserRequestDto,
  ) {
    return UserResponseMapper.toDto(
      await this.proxy.updateCurrentUser(user.id, dto),
    );
  }
  @Patch('me/location')
  @ApiOperation({ summary: 'Update current user location' })
  @ApiBody({ type: UpdateUserLocationRequestDto })
  @ApiOkResponse({ type: UserResponseDto })
  async location(
    @CurrentUser() user: UserModel,
    @Body() dto: UpdateUserLocationRequestDto,
  ) {
    return UserResponseMapper.toDto(
      await this.proxy.updateUserLocation(user.id, dto),
    );
  }
}
