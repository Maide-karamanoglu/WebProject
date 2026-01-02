import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('instructor', 'admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new lesson (Instructor/Admin only)' })
    create(@Body() createLessonDto: CreateLessonDto) {
        return this.lessonsService.create(createLessonDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all lessons' })
    @ApiQuery({ name: 'courseId', required: false })
    findAll(@Query('courseId') courseId?: string) {
        if (courseId) {
            return this.lessonsService.findByCourse(courseId);
        }
        return this.lessonsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get lesson by ID' })
    findOne(@Param('id') id: string) {
        return this.lessonsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('instructor', 'admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update lesson (Instructor/Admin only)' })
    update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
        return this.lessonsService.update(id, updateLessonDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('instructor', 'admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete lesson (Instructor/Admin only)' })
    remove(@Param('id') id: string) {
        return this.lessonsService.remove(id);
    }
}
