import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from '../src/modules/auth/infrastructure/database/user.entity';
import { StudentEntity } from '../src/modules/student/infrastructure/database/student.entity';
import { StudentModule } from '../src/modules/student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.test',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      dropSchema: true,
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
      entities: [UserEntity, StudentEntity],
    }),
    AuthModule,
    StudentModule,
  ],
})
export class TestAppModule {}
