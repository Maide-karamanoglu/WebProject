import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new course (Instructor/Admin only)' })
    create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
        return this.coursesService.create(createCourseDto, req.user);
    }

    @Get()
    @ApiOperation({ summary: 'Get all courses' })
    findAll() {
        return this.coursesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get course by ID' })
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(id);
    }

    @Post(':id/enroll')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Enroll in a course' })
    enroll(@Param('id') id: string, @Request() req) {
        return this.coursesService.enrollStudent(id, req.user);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete course (Instructor/Admin only)' })
    remove(@Param('id') id: string) {
        return this.coursesService.remove(id);
    }
}
