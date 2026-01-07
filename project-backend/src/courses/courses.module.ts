import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { CourseOwnerGuard } from '../common/guards/course-owner.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Course, Category, User])],
    controllers: [CoursesController],
    providers: [CoursesService, CourseOwnerGuard],
    exports: [CoursesService, TypeOrmModule],
})
export class CoursesModule { }

