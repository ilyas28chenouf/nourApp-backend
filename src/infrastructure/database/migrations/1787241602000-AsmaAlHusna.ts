import { MigrationInterface, QueryRunner } from 'typeorm';

export class AsmaAlHusna1787241602000 implements MigrationInterface {
  name = 'AsmaAlHusna1787241602000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "asma_al_husna_names" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "number" smallint NOT NULL UNIQUE CHECK ("number" BETWEEN 1 AND 99),
        "arabicName" varchar(255) NOT NULL,
        "transliteration" varchar(255) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_asma_al_husna_sort" ON "asma_al_husna_names" ("sortOrder", "number")`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "asma_al_husna_translations" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "nameId" uuid NOT NULL,
        "language" varchar(5) NOT NULL CHECK ("language" IN ('ar', 'fr', 'en')),
        "translatedName" varchar(255) NOT NULL,
        "meaning" text NOT NULL,
        "explanation" text NOT NULL,
        "sourceName" varchar(255),
        "sourceReference" varchar(500),
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_asma_al_husna_translation_language" UNIQUE ("nameId", "language"),
        CONSTRAINT "FK_asma_al_husna_translation_name" FOREIGN KEY ("nameId")
          REFERENCES "asma_al_husna_names"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_asma_al_husna_translation_name" ON "asma_al_husna_translations" ("nameId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "asma_al_husna_translations"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "asma_al_husna_names"`);
  }
}
