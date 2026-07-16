import { MigrationInterface, QueryRunner } from 'typeorm';

export class PublishHadithAndTafsirCollections1784214000000 implements MigrationInterface {
  name = 'PublishHadithAndTafsirCollections1784214000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hadith_collections" ADD "published" boolean`,
    );
    await queryRunner.query(
      `UPDATE "hadith_collections" SET "published" = true WHERE "published" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hadith_collections" ALTER COLUMN "published" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "hadith_collections" ALTER COLUMN "published" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "tafsir_collections" ADD "published" boolean`,
    );
    await queryRunner.query(
      `UPDATE "tafsir_collections" SET "published" = true WHERE "published" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tafsir_collections" ALTER COLUMN "published" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "tafsir_collections" ALTER COLUMN "published" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tafsir_collections" DROP COLUMN "published"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hadith_collections" DROP COLUMN "published"`,
    );
  }
}
