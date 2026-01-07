import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { CourseOwnerGuard } from '../common/guards/course-owner.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('instructor', 'admin')
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

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard, CourseOwnerGuard)
    @Roles('instructor', 'admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update course (Owner/Admin only)' })
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Post(':id/upload-image')
    @UseGuards(AuthGuard('jwt'), RolesGuard, CourseOwnerGuard)
    @Roles('instructor', 'admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload course cover image (Owner/Admin only)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/courses',
                filename: (req, file, callback) => {
                    const uniqueSuffix = uuidv4();
                    const ext = extname(file.originalname);
                    callback(null, `${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
                }
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        }),
    )
    async uploadImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded or invalid file type. Allowed types: jpeg, png, gif, webp');
        }
        const imageUrl = `/uploads/courses/${file.filename}`;
        return this.coursesService.update(id, { imageUrl });
    }

    @Post(':id/enroll')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Enroll in a course' })
    enroll(@Param('id') id: string, @Request() req) {
        return this.coursesService.enrollStudent(id, req.user);
    }

    @Delete(':id/enroll')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Unenroll from a course' })
    unenroll(@Param('id') id: string, @Request() req) {
        return this.coursesService.unenrollStudent(id, req.user);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard, CourseOwnerGuard)
    @Roles('instructor', 'admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete course (Owner/Admin only)' })
    remove(@Param('id') id: string) {
        return this.coursesService.remove(id);
    }
}
