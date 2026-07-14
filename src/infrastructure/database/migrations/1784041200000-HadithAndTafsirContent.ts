import { MigrationInterface, QueryRunner } from 'typeorm';

export class HadithAndTafsirContent1784041200000 implements MigrationInterface {
  name = 'HadithAndTafsirContent1784041200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE "hadith_collections" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "key" character varying NOT NULL,
        "name" character varying NOT NULL,
        "arabicName" character varying NOT NULL,
        "author" character varying NOT NULL,
        "reliability" character varying,
        "description" text,
        "sourceName" character varying,
        "sourceUrl" character varying,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_hadith_collections" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_hadith_collections_key" UNIQUE ("key"),
        CONSTRAINT "CHK_hadith_collections_key_slug"
          CHECK ("key" ~ '^[a-z0-9-]+$')
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "hadith_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "collectionId" uuid NOT NULL,
        "hadithNumber" integer NOT NULL,
        "arabic" text NOT NULL,
        "english" text,
        "french" text,
        "grade" character varying,
        "narrator" character varying,
        "chapter" character varying,
        "sourceReference" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_hadith_items" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_hadith_items_collection_number"
          UNIQUE ("collectionId", "hadithNumber"),
        CONSTRAINT "CHK_hadith_items_number_positive"
          CHECK ("hadithNumber" >= 1),
        CONSTRAINT "FK_hadith_items_collection"
          FOREIGN KEY ("collectionId") REFERENCES "hadith_collections"("id")
          ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_hadith_items_collection_id" ON "hadith_items" ("collectionId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_hadith_items_hadith_number" ON "hadith_items" ("hadithNumber")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_hadith_items_grade" ON "hadith_items" ("grade")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_hadith_items_is_active" ON "hadith_items" ("isActive")`,
    );

    await queryRunner.query(`
      CREATE TABLE "tafsir_collections" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "key" character varying NOT NULL,
        "name" character varying NOT NULL,
        "arabicName" character varying,
        "author" character varying NOT NULL,
        "language" character varying NOT NULL,
        "description" text,
        "sourceName" character varying,
        "sourceUrl" character varying,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tafsir_collections" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_tafsir_collections_key" UNIQUE ("key"),
        CONSTRAINT "CHK_tafsir_collections_key_slug"
          CHECK ("key" ~ '^[a-z0-9-]+$')
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tafsir_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "collectionId" uuid NOT NULL,
        "surahNumber" integer NOT NULL,
        "ayahNumber" integer NOT NULL,
        "surahName" character varying,
        "title" character varying,
        "content" text NOT NULL,
        "sourceReference" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tafsir_items" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_tafsir_items_collection_surah_ayah"
          UNIQUE ("collectionId", "surahNumber", "ayahNumber"),
        CONSTRAINT "CHK_tafsir_items_surah_range"
          CHECK ("surahNumber" BETWEEN 1 AND 114),
        CONSTRAINT "CHK_tafsir_items_ayah_positive"
          CHECK ("ayahNumber" >= 1),
        CONSTRAINT "FK_tafsir_items_collection"
          FOREIGN KEY ("collectionId") REFERENCES "tafsir_collections"("id")
          ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_tafsir_items_collection_id" ON "tafsir_items" ("collectionId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tafsir_items_surah_number" ON "tafsir_items" ("surahNumber")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tafsir_items_ayah_number" ON "tafsir_items" ("ayahNumber")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tafsir_items_is_active" ON "tafsir_items" ("isActive")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tafsir_items"`);
    await queryRunner.query(`DROP TABLE "tafsir_collections"`);
    await queryRunner.query(`DROP TABLE "hadith_items"`);
    await queryRunner.query(`DROP TABLE "hadith_collections"`);
  }
}
