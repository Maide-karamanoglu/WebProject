import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Injectable()
export class CourseOwnerGuard implements CanActivate {
    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const courseId = request.params.id;

        // Get user role name (handles both entity relation and JWT payload)
        const userRoleName = user.role?.name || user.roleName || user.role;

        // Admin can access any course
        if (userRoleName === 'admin') {
            return true;
        }

        // Find the course with instructor relation
        const course = await this.coursesRepository.findOne({
            where: { id: courseId },
            relations: ['instructor'],
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        // Check if the user is the instructor of this course
        const userId = user.sub || user.id;
        if (course.instructor.id !== userId) {
            throw new ForbiddenException('You can only modify your own courses');
        }

        return true;
    }
}
