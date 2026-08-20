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
import { QuranUsecasesProxyService } from '../../../usecases-proxy/quran/quran-usecases-proxy.service';
import { CreateQuranReadingGoalRequestDto } from '../dto/request/create-quran-reading-goal.request.dto';
import { CreateQuranReadingLogRequestDto } from '../dto/request/create-quran-reading-log.request.dto';
import { CreateQuranMemorizationRequestDto } from '../dto/request/create-quran-memorization.request.dto';
import { UpdateQuranReadingGoalRequestDto } from '../dto/request/update-quran-reading-goal.request.dto';
import { UpdateQuranReadingLogRequestDto } from '../dto/request/update-quran-reading-log.request.dto';
import { UpdateQuranMemorizationRequestDto } from '../dto/request/update-quran-memorization.request.dto';
import { QuranReadingGoalResponseDto } from '../dto/response/quran-reading-goal.response.dto';
import { QuranReadingLogResponseDto } from '../dto/response/quran-reading-log.response.dto';
import { QuranSummaryResponseDto } from '../dto/response/quran-summary.response.dto';
import { QuranResponseMapper } from '../mappers/quran.response.mapper';
@ApiTags('Quran')
@ApiBearerAuth()
@ProtectedApi()
@Controller('quran')
export class QuranController {
  constructor(private readonly proxy: QuranUsecasesProxyService) {}
  @Get('logs')
  @ApiOperation({ summary: 'Get Quran reading logs' })
  @ApiOkResponse({ type: [QuranReadingLogResponseDto] })
  async logs(
    @CurrentUser() user: UserModel,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return QuranResponseMapper.toDto(await this.proxy.logs(user.id, from, to));
  }
  @Post('logs')
  @ApiOperation({ summary: 'Create Quran reading log' })
  @ApiBody({ type: CreateQuranReadingLogRequestDto })
  @ApiOkResponse({ type: QuranReadingLogResponseDto })
  async createLog(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateQuranReadingLogRequestDto,
  ) {
    return QuranResponseMapper.toDto(await this.proxy.createLog(user.id, dto));
  }
  @Patch('logs/:id')
  @ApiOperation({ summary: 'Update Quran reading log' })
  @ApiBody({ type: UpdateQuranReadingLogRequestDto })
  @ApiOkResponse({ type: QuranReadingLogResponseDto })
  async updateLog(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateQuranReadingLogRequestDto,
  ) {
    return QuranResponseMapper.toDto(
      await this.proxy.updateLog(user.id, id, dto),
    );
  }
  @Delete('logs/:id')
  @ApiOperation({ summary: 'Delete Quran reading log' })
  @ApiOkResponse({ description: 'Deleted' })
  async deleteLog(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return QuranResponseMapper.toDto(await this.proxy.deleteLog(user.id, id));
  }
  @Get('goals')
  @ApiOperation({ summary: 'Get Quran reading goals' })
  @ApiOkResponse({ type: [QuranReadingGoalResponseDto] })
  async goals(@CurrentUser() user: UserModel) {
    return QuranResponseMapper.toDto(await this.proxy.goals(user.id));
  }
  @Post('goals')
  @ApiOperation({ summary: 'Create Quran reading goal' })
  @ApiBody({ type: CreateQuranReadingGoalRequestDto })
  @ApiOkResponse({ type: QuranReadingGoalResponseDto })
  async createGoal(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateQuranReadingGoalRequestDto,
  ) {
    return QuranResponseMapper.toDto(await this.proxy.createGoal(user.id, dto));
  }
  @Patch('goals/:id')
  @ApiOperation({ summary: 'Update Quran reading goal' })
  @ApiBody({ type: UpdateQuranReadingGoalRequestDto })
  @ApiOkResponse({ type: QuranReadingGoalResponseDto })
  async updateGoal(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateQuranReadingGoalRequestDto,
  ) {
    return QuranResponseMapper.toDto(
      await this.proxy.updateGoal(user.id, id, dto),
    );
  }
  @Delete('goals/:id')
  @ApiOperation({ summary: 'Delete Quran reading goal' })
  @ApiOkResponse({ description: 'Deleted' })
  async deleteGoal(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return QuranResponseMapper.toDto(await this.proxy.deleteGoal(user.id, id));
  }
  @Get('summary')
  @ApiOperation({ summary: 'Get Quran summary' })
  @ApiOkResponse({ type: QuranSummaryResponseDto })
  async summary(
    @CurrentUser() user: UserModel,
    @Query('period') period: string,
  ) {
    return QuranResponseMapper.toDto(await this.proxy.summary(user.id, period));
  }
  @Get('surahs')
  @ApiOperation({ summary: 'Proxy Quran surahs from Ummah API' })
  @ApiOkResponse({ description: 'Surahs' })
  surahs(
    @Query('script') script?: string,
    @Query('translation') translation?: string,
    @Query('reciter') reciter?: string,
  ) {
    return this.proxy.provider().getSurahs({ script, translation, reciter });
  }
  @Get('surah/:number')
  @ApiOperation({ summary: 'Proxy Quran surah from Ummah API' })
  @ApiOkResponse({ description: 'Surah' })
  surah(
    @Param('number') number: string,
    @Query('script') script?: string,
    @Query('translation') translation?: string,
    @Query('reciter') reciter?: string,
  ) {
    return this.proxy
      .provider()
      .getSurah(number, { script, translation, reciter });
  }
  @Get('surah/:surah/ayah/:ayah')
  @ApiOperation({ summary: 'Proxy Quran ayah from Ummah API' })
  @ApiOkResponse({ description: 'Ayah' })
  ayah(
    @Param('surah') surah: string,
    @Param('ayah') ayah: string,
    @Query('script') script?: string,
    @Query('translation') translation?: string,
    @Query('reciter') reciter?: string,
  ) {
    return this.proxy
      .provider()
      .getAyah(surah, ayah, { script, translation, reciter });
  }
  @Get('search')
  @ApiOperation({ summary: 'Search Quran through Ummah API' })
  @ApiOkResponse({ description: 'Search results' })
  search(
    @Query('q') q?: string,
    @Query('script') script?: string,
    @Query('translation') translation?: string,
  ) {
    return this.proxy.provider().search({ q, script, translation });
  }
  @Get('juz/:number')
  @ApiOperation({ summary: 'Proxy Quran juz from Ummah API' })
  @ApiOkResponse({ description: 'Juz' })
  juz(
    @Param('number') number: string,
    @Query('translation') translation?: string,
  ) {
    return this.proxy.provider().getJuz(number, { translation });
  }
  @Get('page/:number')
  @ApiOperation({ summary: 'Proxy Quran page from Ummah API' })
  @ApiOkResponse({ description: 'Page' })
  page(
    @Param('number') number: string,
    @Query('translation') translation?: string,
  ) {
    return this.proxy.provider().getPage(number, { translation });
  }
  @Get('reciters')
  @ApiOperation({ summary: 'Proxy Quran reciters from Ummah API' })
  @ApiOkResponse({ description: 'Reciters' })
  reciters() {
    return this.proxy.provider().getReciters();
  }
  @Get('audio/:surah')
  @ApiOperation({ summary: 'Proxy Quran surah audio from Ummah API' })
  @ApiOkResponse({ description: 'Audio' })
  audioSurah(
    @Param('surah') surah: string,
    @Query('reciter') reciter?: string,
  ) {
    return this.proxy.provider().getAudio(surah, undefined, { reciter });
  }
  @Get('audio/:surah/:ayah')
  @ApiOperation({ summary: 'Proxy Quran ayah audio from Ummah API' })
  @ApiOkResponse({ description: 'Audio' })
  audioAyah(
    @Param('surah') surah: string,
    @Param('ayah') ayah: string,
    @Query('reciter') reciter?: string,
  ) {
    return this.proxy.provider().getAudio(surah, ayah, { reciter });
  }
  @Get('memorization')
  @ApiOperation({ summary: 'Get Quran memorization progress' })
  @ApiOkResponse({ description: 'Memorization progress' })
  memorization(@CurrentUser() user: UserModel) {
    return this.proxy.memorization(user.id);
  }
  @Post('memorization')
  @ApiOperation({ summary: 'Create Quran memorization progress' })
  @ApiBody({ type: CreateQuranMemorizationRequestDto })
  @ApiOkResponse({ description: 'Memorization progress' })
  createMemorization(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateQuranMemorizationRequestDto,
  ) {
    return this.proxy.createMemorization(user.id, dto);
  }
  @Patch('memorization/:id')
  @ApiOperation({ summary: 'Update Quran memorization progress' })
  @ApiBody({ type: UpdateQuranMemorizationRequestDto })
  @ApiOkResponse({ description: 'Memorization progress' })
  updateMemorization(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateQuranMemorizationRequestDto,
  ) {
    return this.proxy.updateMemorization(user.id, id, dto);
  }
}
