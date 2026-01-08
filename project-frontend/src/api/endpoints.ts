import api from './axios';

// Auth endpoints
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    register: (data: {
        email: string;
        password: string;
        fullName: string;
    }) => api.post('/auth/register', data),

    getProfile: () => api.get('/users/profile'),
};

// Users endpoints
export const usersApi = {
    getAll: () => api.get('/users'),
    getOne: (id: string) => api.get(`/users/${id}`),
    updateProfile: (data: { fullName?: string; password?: string }) =>
        api.patch('/users/profile', data),
    updateRole: (userId: string, roleId: number) =>
        api.patch(`/users/${userId}`, { roleId }),
    delete: (id: string) => api.delete(`/users/${id}`),
};

// Courses endpoints
export const coursesApi = {
    getAll: () => api.get('/courses'),
    getOne: (id: string) => api.get(`/courses/${id}`),
    create: (data: {
        title: string;
        description?: string;
        price?: number;
        categoryIds?: string[];
    }) => api.post('/courses', data),
    update: (id: string, data: object) => api.patch(`/courses/${id}`, data),
    delete: (id: string) => api.delete(`/courses/${id}`),
    enroll: (id: string) => api.post(`/courses/${id}/enroll`),
    unenroll: (id: string) => api.delete(`/courses/${id}/enroll`),
    uploadImage: (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/courses/${id}/upload-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// Lessons endpoints
export const lessonsApi = {
    getAll: (courseId?: string) =>
        api.get('/lessons', { params: courseId ? { courseId } : {} }),
    getOne: (id: string) => api.get(`/lessons/${id}`),
    create: (data: {
        title: string;
        content?: string;
        videoUrl?: string;
        order?: number;
        courseId: string;
    }) => api.post('/lessons', data),
    update: (id: string, data: object) => api.patch(`/lessons/${id}`, data),
    delete: (id: string) => api.delete(`/lessons/${id}`),
};

// Categories endpoints
export const categoriesApi = {
    getAll: () => api.get('/categories'),
    getOne: (id: string) => api.get(`/categories/${id}`),
    create: (data: { name: string }) => api.post('/categories', data),
    update: (id: string, data: { name?: string }) =>
        api.patch(`/categories/${id}`, data),
    delete: (id: string) => api.delete(`/categories/${id}`),
};

// Roles endpoints (Admin only)
export const rolesApi = {
    getAll: () => api.get('/roles'),
    getOne: (id: number) => api.get(`/roles/${id}`),
};
