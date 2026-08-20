import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AsmaAlHusnaUsecasesProxyService } from '../../../usecases-proxy/asma-al-husna/asma-al-husna-usecases-proxy.service';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import { AsmaAlHusnaNumberParamDto } from '../dto/request/asma-al-husna-param.dto';
import { AsmaAlHusnaResponseDto } from '../dto/response/asma-al-husna.response.dto';
import { AsmaAlHusnaResponseMapper } from '../mappers/asma-al-husna.response.mapper';

@ApiTags('Asma al-Husna')
@ApiBearerAuth()
@ProtectedApi()
@Controller('asma-al-husna')
export class AsmaAlHusnaController {
  constructor(private readonly proxy: AsmaAlHusnaUsecasesProxyService) {}

  @Get()
  @ApiOperation({ summary: 'List approved active Names of Allah' })
  @ApiOkResponse({ type: [AsmaAlHusnaResponseDto] })
  async list() {
    return AsmaAlHusnaResponseMapper.toDtoList(await this.proxy.list());
  }

  @Get(':number')
  @ApiOperation({ summary: 'Get one approved Name of Allah by number' })
  @ApiOkResponse({ type: AsmaAlHusnaResponseDto })
  @ApiNotFoundResponse({ description: 'Name not found' })
  async get(@Param() params: AsmaAlHusnaNumberParamDto) {
    return AsmaAlHusnaResponseMapper.toDto(await this.proxy.get(params.number));
  }
}
