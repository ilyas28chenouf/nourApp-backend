import dataSource from '../../infrastructure/database/typeorm.data-source';
import { DailyReminderContentType } from '../../domain/notifications/enums/daily-reminder-content-type.enum';
import { DailyReminderContentTypeormEntity } from '../../infrastructure/notifications/entities/daily-reminder-content.typeorm-entity';
import { dailyReminders } from './daily-reminders.data';

type DailyReminderSeedRecord = {
  cycleDay: number;
  type: string;
  arabicText?: string | null;
  frenchText: string;
  source: string;
};

async function seedDailyReminders() {
  validateDailyReminders(dailyReminders);
  const data = await dataSource.initialize();
  try {
    const repository = data.getRepository(DailyReminderContentTypeormEntity);
    await repository.upsert(
      (dailyReminders as DailyReminderSeedRecord[]).map((reminder) => ({
        cycleDay: reminder.cycleDay,
        type: reminder.type as DailyReminderContentType,
        arabicText: reminder.arabicText ?? null,
        frenchText: reminder.frenchText,
        source: reminder.source,
        isActive: true,
      })),
      ['cycleDay'],
    );
    console.log(`Imported ${dailyReminders.length} daily reminders`);
  } finally {
    await data.destroy();
  }
}

function validateDailyReminders(records: DailyReminderSeedRecord[]) {
  if (records.length !== 120) {
    throw new Error(
      `Expected exactly 120 daily reminders, found ${records.length}`,
    );
  }

  const cycleDays = new Set<number>();
  for (const record of records) {
    if (!Number.isInteger(record.cycleDay)) {
      throw new Error(`Invalid cycleDay: ${record.cycleDay}`);
    }
    if (record.cycleDay < 1 || record.cycleDay > 120) {
      throw new Error(`cycleDay must be in range 1..120: ${record.cycleDay}`);
    }
    if (cycleDays.has(record.cycleDay)) {
      throw new Error(`Duplicate cycleDay: ${record.cycleDay}`);
    }
    cycleDays.add(record.cycleDay);
    if (!['VERSE', 'HADITH'].includes(record.type)) {
      throw new Error(`Invalid reminder type for day ${record.cycleDay}`);
    }
    if (!record.frenchText?.trim()) {
      throw new Error(`Missing frenchText for day ${record.cycleDay}`);
    }
    if (!record.source?.trim()) {
      throw new Error(`Missing source for day ${record.cycleDay}`);
    }
  }

  for (let cycleDay = 1; cycleDay <= 120; cycleDay += 1) {
    if (!cycleDays.has(cycleDay)) {
      throw new Error(`Missing cycleDay: ${cycleDay}`);
    }
  }
}

seedDailyReminders().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
