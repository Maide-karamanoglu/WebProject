import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createCourseDto: CreateCourseDto, instructor: User): Promise<Course> {
        const { categoryIds, ...courseData } = createCourseDto;

        const course = this.coursesRepository.create({
            ...courseData,
            instructor,
        });

        if (categoryIds && categoryIds.length > 0) {
            course.categories = await this.categoriesRepository.findBy({
                id: In(categoryIds),
            });
        }

        return this.coursesRepository.save(course);
    }

    async findAll(): Promise<Course[]> {
        return this.coursesRepository.find({
            relations: ['instructor', 'instructor.role', 'categories', 'lessons', 'enrolledStudents'],
        });
    }

    async findOne(id: string): Promise<Course> {
        const course = await this.coursesRepository.findOne({
            where: { id },
            relations: ['instructor', 'instructor.role', 'categories', 'lessons', 'enrolledStudents'],
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        return course;
    }

    async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
        const course = await this.findOne(id);

        const { categoryIds, ...courseData } = updateCourseDto;

        // Update basic fields
        Object.assign(course, courseData);

        // Update categories if provided
        if (categoryIds !== undefined) {
            if (categoryIds.length > 0) {
                course.categories = await this.categoriesRepository.findBy({
                    id: In(categoryIds),
                });
            } else {
                course.categories = [];
            }
        }

        return this.coursesRepository.save(course);
    }

    async enrollStudent(courseId: string, jwtPayload: { sub: string }): Promise<Course> {
        const course = await this.findOne(courseId);

        // Get the actual user from database
        const userId = jwtPayload.sub;
        const student = await this.usersRepository.findOne({ where: { id: userId } });

        if (!student) {
            throw new NotFoundException('User not found');
        }

        // Check if already enrolled
        const isAlreadyEnrolled = course.enrolledStudents?.some(s => s.id === userId);
        if (isAlreadyEnrolled) {
            throw new BadRequestException('You are already enrolled in this course');
        }

        // Check if user is the instructor
        if (course.instructor?.id === userId) {
            throw new BadRequestException('Instructors cannot enroll in their own courses');
        }

        if (!course.enrolledStudents) {
            course.enrolledStudents = [];
        }

        course.enrolledStudents.push(student);
        await this.coursesRepository.save(course);

        return this.findOne(courseId); // Return with fresh relations
    }

    async unenrollStudent(courseId: string, jwtPayload: { sub: string }): Promise<{ message: string }> {
        const course = await this.findOne(courseId);

        const userId = jwtPayload.sub;

        if (!course.enrolledStudents || course.enrolledStudents.length === 0) {
            throw new NotFoundException('You are not enrolled in this course');
        }

        const studentIndex = course.enrolledStudents.findIndex(s => s.id === userId);
        if (studentIndex === -1) {
            throw new NotFoundException('You are not enrolled in this course');
        }

        course.enrolledStudents.splice(studentIndex, 1);
        await this.coursesRepository.save(course);

        return { message: 'Successfully unenrolled from the course' };
    }

    async remove(id: string): Promise<void> {
        const result = await this.coursesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
    }
}
