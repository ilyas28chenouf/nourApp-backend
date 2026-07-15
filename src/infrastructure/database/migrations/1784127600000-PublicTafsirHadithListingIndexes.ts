import { MigrationInterface, QueryRunner } from 'typeorm';

export class PublicTafsirHadithListingIndexes1784127600000 implements MigrationInterface {
  name = 'PublicTafsirHadithListingIndexes1784127600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "IDX_tafsir_items_public_listing"
      ON "tafsir_items" ("collectionId", "isActive", "surahNumber", "ayahNumber")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_hadith_items_public_listing"
      ON "hadith_items" ("collectionId", "isActive", "hadithNumber")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_hadith_items_public_listing"`);
    await queryRunner.query(`DROP INDEX "IDX_tafsir_items_public_listing"`);
  }
}
