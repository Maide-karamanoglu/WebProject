import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ) { }

    async onModuleInit() {
        await this.seedRoles();
        await this.seedAdminUser();
    }

    private async seedRoles(): Promise<void> {
        const defaultRoles = [
            { name: 'admin', description: 'Administrator with full access' },
            { name: 'instructor', description: 'Can create and manage courses' },
            { name: 'student', description: 'Can enroll in and access courses' },
        ];

        for (const roleData of defaultRoles) {
            const existingRole = await this.rolesRepository.findOne({
                where: { name: roleData.name },
            });

            if (!existingRole) {
                const role = this.rolesRepository.create(roleData);
                await this.rolesRepository.save(role);
                console.log(`[Seeder] Created role: ${roleData.name}`);
            }
        }
    }

    private async seedAdminUser(): Promise<void> {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@ocms.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
        const adminFullName = process.env.ADMIN_FULLNAME || 'System Administrator';

        // Check if admin already exists
        const existingAdmin = await this.usersRepository.findOne({
            where: { email: adminEmail },
        });

        if (existingAdmin) {
            console.log('[Seeder] Admin user already exists, skipping...');
            return;
        }

        // Get admin role
        const adminRole = await this.rolesRepository.findOne({
            where: { name: 'admin' },
        });

        if (!adminRole) {
            console.error('[Seeder] Admin role not found! Cannot create admin user.');
            return;
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        // Create admin user
        const adminUser = this.usersRepository.create({
            email: adminEmail,
            password: hashedPassword,
            fullName: adminFullName,
            role: adminRole,
            roleId: adminRole.id,
        });

        await this.usersRepository.save(adminUser);
        console.log(`[Seeder] Created admin user: ${adminEmail}`);
        console.log('[Seeder] Default credentials:');
        console.log(`  Email: ${adminEmail}`);
        console.log(`  Password: ${adminPassword}`);
        console.log('[Seeder] ⚠️  Please change the default password after first login!');
    }
}
