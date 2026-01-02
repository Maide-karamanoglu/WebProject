import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ) { }

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const existingRole = await this.rolesRepository.findOne({
            where: { name: createRoleDto.name },
        });

        if (existingRole) {
            throw new ConflictException('Role with this name already exists');
        }

        const role = this.rolesRepository.create(createRoleDto);
        return this.rolesRepository.save(role);
    }

    async findAll(): Promise<Role[]> {
        return this.rolesRepository.find();
    }

    async findOne(id: number): Promise<Role> {
        const role = await this.rolesRepository.findOne({
            where: { id },
            relations: ['users'],
        });

        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }

        return role;
    }

    async findByName(name: string): Promise<Role | null> {
        return this.rolesRepository.findOne({ where: { name } });
    }

    async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
        const role = await this.findOne(id);
        Object.assign(role, updateRoleDto);
        return this.rolesRepository.save(role);
    }

    async remove(id: number): Promise<void> {
        const result = await this.rolesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }
    }

    async ensureDefaultRoles(): Promise<void> {
        const defaultRoles = [
            { name: 'admin', description: 'Administrator with full access' },
            { name: 'instructor', description: 'Can create and manage courses' },
            { name: 'student', description: 'Can enroll in and access courses' },
        ];

        for (const roleData of defaultRoles) {
            const existingRole = await this.findByName(roleData.name);
            if (!existingRole) {
                await this.rolesRepository.save(this.rolesRepository.create(roleData));
            }
        }
    }
}
