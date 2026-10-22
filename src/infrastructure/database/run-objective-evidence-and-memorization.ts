import { QueryRunner } from 'typeorm';
import dataSource from './typeorm.data-source';
import { ObjectiveEvidenceAndMemorization1792627200000 } from './migrations/1792627200000-ObjectiveEvidenceAndMemorization';

const MIGRATIONS_TABLE = 'migrations';
const TARGET_TIMESTAMP = 1792627200000;
const targetMigration = new ObjectiveEvidenceAndMemorization1792627200000();

async function isTargetRecorded(queryRunner: QueryRunner): Promise<boolean> {
  const rows = (await queryRunner.query(
    `
        SELECT 1
        FROM "${MIGRATIONS_TABLE}"
        WHERE "timestamp" = $1 OR "name" = $2
        LIMIT 1
      `,
    [TARGET_TIMESTAMP, targetMigration.name],
  )) as unknown[];

  return rows.length > 0;
}

async function runTargetMigration(): Promise<void> {
  await dataSource.initialize();

  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Prevent two deployments from applying the same targeted migration at once.
    await queryRunner.query('SELECT pg_advisory_xact_lock($1)', [
      TARGET_TIMESTAMP,
    ]);

    if (await isTargetRecorded(queryRunner)) {
      await queryRunner.commitTransaction();
      console.log(
        `Migration already recorded, nothing to do: ${targetMigration.name}`,
      );
      return;
    }

    await targetMigration.up(queryRunner);
    await queryRunner.query(
      `
        INSERT INTO "${MIGRATIONS_TABLE}" ("timestamp", "name")
        VALUES ($1, $2)
      `,
      [TARGET_TIMESTAMP, targetMigration.name],
    );

    await queryRunner.commitTransaction();
    console.log(`Executed migration: ${targetMigration.name}`);
  } catch (error) {
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }
    throw error;
  } finally {
    try {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    } finally {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
    }
  }
}

void runTargetMigration().catch((error: unknown) => {
  console.error('Targeted production migration failed:', error);
  process.exitCode = 1;
});
