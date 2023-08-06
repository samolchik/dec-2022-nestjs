import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1691170858808 implements MigrationInterface {
    name = 'InitialMigration1691170858808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "animal" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "class" character varying NOT NULL, "type" boolean NOT NULL DEFAULT true, "age" integer, "userId" integer, CONSTRAINT "PK_af42b1374c042fb3fa2251f9f42" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "animal" ADD CONSTRAINT "FK_305006f0101340847e1da2edb61" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animal" DROP CONSTRAINT "FK_305006f0101340847e1da2edb61"`);
        await queryRunner.query(`DROP TABLE "animal"`);
    }

}
