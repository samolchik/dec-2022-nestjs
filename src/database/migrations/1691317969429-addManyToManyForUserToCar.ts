import { MigrationInterface, QueryRunner } from "typeorm";

export class AddManyToManyForUserToCar1691317969429 implements MigrationInterface {
    name = 'AddManyToManyForUserToCar1691317969429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "car_users_user" ("carId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_4eb6622865a36343e8dd84cc622" PRIMARY KEY ("carId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e395ec55e2197c033a5f266dca" ON "car_users_user" ("carId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4e988df1238da4a9a8c2200a42" ON "car_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "car_users_user" ADD CONSTRAINT "FK_e395ec55e2197c033a5f266dca5" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "car_users_user" ADD CONSTRAINT "FK_4e988df1238da4a9a8c2200a429" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_users_user" DROP CONSTRAINT "FK_4e988df1238da4a9a8c2200a429"`);
        await queryRunner.query(`ALTER TABLE "car_users_user" DROP CONSTRAINT "FK_e395ec55e2197c033a5f266dca5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4e988df1238da4a9a8c2200a42"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e395ec55e2197c033a5f266dca"`);
        await queryRunner.query(`DROP TABLE "car_users_user"`);
    }

}
