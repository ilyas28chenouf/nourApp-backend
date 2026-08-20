import { resolveCalendarRange } from '../../common-utils/dates/calendar-period.util';
import { CharityActionType } from '../../domain/charity/enums/charity-action-type.enum';

export class GetCharitySummaryUsecase {
  constructor(
    private readonly persistence: import('../../domain/charity/ports/charity-persistence.port').CharityPersistencePort,
  ) {}
  async execute(userId: string, period: string) {
    const range = resolveCalendarRange(period);
    const logs = (await this.persistence.findByUserId(userId)).filter(
      (log) => log.charityDate >= range.from && log.charityDate <= range.to,
    );
    const actionTypes = Object.values(CharityActionType)
      .map((actionType) => {
        const matching = logs.filter((log) => log.actionType === actionType);
        return {
          actionType,
          count: matching.length,
          totalAmount: matching.reduce(
            (sum, log) => sum + Number(log.amount ?? 0),
            0,
          ),
        };
      })
      .filter((summary) => summary.count > 0);
    return {
      ...range,
      count: logs.length,
      totalAmount: logs.reduce((sum, log) => sum + Number(log.amount ?? 0), 0),
      actionTypes,
    };
  }
}
