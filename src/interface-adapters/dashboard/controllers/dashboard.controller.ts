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
import { DashboardUsecasesProxyService } from '../../../usecases-proxy/dashboard/dashboard-usecases-proxy.service';
import { DashboardPeriodResponseDto } from '../dto/response/dashboard-period.response.dto';
import { DashboardTodayResponseDto } from '../dto/response/dashboard-today.response.dto';
import { DashboardResponseMapper } from '../mappers/dashboard.response.mapper';
@ApiTags('Dashboard')
@ApiBearerAuth()
@ProtectedApi()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly proxy: DashboardUsecasesProxyService) {}
  @Get('today')
  @ApiOperation({ summary: 'Get today dashboard' })
  @ApiOkResponse({ type: DashboardTodayResponseDto })
  today(@CurrentUser() user: UserModel) {
    return DashboardResponseMapper.toDto(
      this.proxy.today(user.id, user.timezone),
    );
  }
  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly dashboard' })
  @ApiOkResponse({ type: DashboardPeriodResponseDto })
  weekly(@CurrentUser() user: UserModel) {
    return DashboardResponseMapper.toDto(this.proxy.weekly(user.id));
  }
  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly dashboard' })
  @ApiOkResponse({ type: DashboardPeriodResponseDto })
  monthly(@CurrentUser() user: UserModel) {
    return DashboardResponseMapper.toDto(this.proxy.monthly(user.id));
  }
  @Get('yearly')
  @ApiOperation({ summary: 'Get yearly dashboard' })
  @ApiOkResponse({ type: DashboardPeriodResponseDto })
  yearly(@CurrentUser() user: UserModel) {
    return DashboardResponseMapper.toDto(this.proxy.yearly(user.id));
  }
  @Get('range')
  @ApiOperation({ summary: 'Get range dashboard' })
  @ApiOkResponse({ type: DashboardPeriodResponseDto })
  range(
    @CurrentUser() user: UserModel,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return DashboardResponseMapper.toDto(this.proxy.range(user.id, from, to));
  }
}
