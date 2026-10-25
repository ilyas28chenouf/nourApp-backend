import { FastingStatus } from '../../domain/fasting/enums/fasting-status.enum';
import { FastingType } from '../../domain/fasting/enums/fasting-type.enum';
import { CreateFastingLogUsecase } from './create-fasting-log.usecase';
import { UpdateFastingLogUsecase } from './update-fasting-log.usecase';

function dateInDaysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

function existingLog(fastingDate = dateInDaysFromNow(1)) {
  return {
    id: 'fasting-1',
    userId: 'user-1',
    fastingDate,
    fastingType: FastingType.WHITE_DAYS,
    status: FastingStatus.PLANNED,
  };
}

describe('fasting completion date validation', () => {
  it('rejects creating a completed fast for a future date', () => {
    const createLog = jest.fn();
    const usecase = new CreateFastingLogUsecase({
      createLog,
    } as never);

    expect(() =>
      usecase.execute('user-1', {
        fastingDate: dateInDaysFromNow(1),
        fastingType: FastingType.WHITE_DAYS,
        status: FastingStatus.FASTED,
      }),
    ).toThrow('A future fasting date cannot be completed');
    expect(createLog).not.toHaveBeenCalled();
  });

  it('rejects updating a planned future fast to completed', async () => {
    const updateLog = jest.fn();
    const usecase = new UpdateFastingLogUsecase({
      findLogById: jest.fn().mockResolvedValue(existingLog()),
      updateLog,
    } as never);

    await expect(
      usecase.execute('user-1', 'fasting-1', {
        status: FastingStatus.FASTED,
      }),
    ).rejects.toThrow('A future fasting date cannot be completed');
    expect(updateLog).not.toHaveBeenCalled();
  });
});
