import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeeder } from './database.seeder';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    providers: [DatabaseSeeder],
    exports: [DatabaseSeeder],
})
export class DatabaseModule { }
