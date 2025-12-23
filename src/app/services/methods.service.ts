import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Permisos } from '../models/permisos.model';
import { apis } from '../models/apis.model';
import { ResponseModel } from '../models/response.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MethodsService {
     constructor(
        public repos: GenericService,
    ) { }

    public async get(endpoint: string, api: string): Promise<any | null> {
        const url = `${endpoint}`;
        return new Promise((resolve, reject) => {
            this.repos.getWithOutParameters(url, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: HttpErrorResponse) => {
                    console.error('❌ Error capturado:');
                    console.error('Status:', error.status);
                    console.error('Mensaje:', error.message);
                    console.error('URL:', error.url);

                    // 🔹 Detectar error de autenticación
                    if (error.status === 401) {
                        console.warn('⚠️ No se pudo autenticar el usuario (401 Unauthorized)');
                        reject({ message: 'No autorizado', code: 401 });
                    } else {
                        // Otros errores (500, 404, etc.)
                        reject(error);
                    }
                }
            });
        });
    }

    public async getFirst(endpoint: string, api: string): Promise<any | null> {
        const url = `${endpoint}/first`;
        return new Promise((resolve, reject) => {
            this.repos.getWithOutParameters(url, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: HttpErrorResponse) => {
                    console.error('❌ Error capturado:');
                    console.error('Status:', error.status);
                    console.error('Mensaje:', error.message);
                    console.error('URL:', error.url);

                    // 🔹 Detectar error de autenticación
                    if (error.status === 401) {
                        console.warn('⚠️ No se pudo autenticar el usuario (401 Unauthorized)');
                        reject({ message: 'No autorizado', code: 401 });
                    } else {
                        // Otros errores (500, 404, etc.)
                        reject(error);
                    }
                }
            });
        });
    }

    public async getAll(endpoint: string, api: string): Promise<ResponseModel | null> {
        const url = `${endpoint}`;
        return new Promise((resolve, reject) => {
            this.repos.getWithOutParameters(url, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: HttpErrorResponse) => {
                    console.error('❌ Error capturado:');
                    console.error('Status:', error.status);
                    console.error('Mensaje:', error.message);
                    console.error('URL:', error.url);

                    // 🔹 Detectar error de autenticación
                    if (error.status === 401) {
                        console.warn('⚠️ No se pudo autenticar el usuario (401 Unauthorized)');
                        reject({ message: 'No autorizado', code: 401 });
                    } else {
                        // Otros errores (500, 404, etc.)
                        reject(error);
                    }
                }
            });
        });
    }
    
    public async getById(endpoint: string, id: number, api: string): Promise<ResponseModel | null>{
        const url = `${endpoint}/${id}`;
        return new Promise((resolve, reject) => {
            this.repos.get(url, ``, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: HttpErrorResponse) => {
                    console.error('❌ Error capturado:');
                    console.error('Status:', error.status);
                    console.error('Mensaje:', error.message);
                    console.error('URL:', error.url);

                    // 🔹 Detectar error de autenticación
                    if (error.status === 401) {
                        console.warn('⚠️ No se pudo autenticar el usuario (401 Unauthorized)');
                        reject({ message: 'No autorizado', code: 401 });
                    } else {
                        // Otros errores (500, 404, etc.)
                        reject(error);
                    }
                }
            });
        });
    }

    public async getOnDemand(endpoint: string, page: number, pageSize: number, search: string , api: string): Promise<ResponseModel | null>{
        const url = `${endpoint}/OnDemand?page=${page}&pageSize=${pageSize}&search=${search}`;
        return new Promise((resolve, reject) => {
            this.repos.get(url, ``, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: HttpErrorResponse) => {
                    console.error('❌ Error capturado:');
                    console.error('Status:', error.status);
                    console.error('Mensaje:', error.message);
                    console.error('URL:', error.url);

                    // 🔹 Detectar error de autenticación
                    if (error.status === 401) {
                        console.warn('⚠️ No se pudo autenticar el usuario (401 Unauthorized)');
                        reject({ message: 'No autorizado', code: 401 });
                    } else {
                        // Otros errores (500, 404, etc.)
                        reject(error);
                    }
                }
            });
        });
    }

    public async post<T>(endpoint: string, data: T, api: string): Promise<ResponseModel | null> {
        return new Promise((resolve, reject) => {
            let url = `${endpoint}`;
            this.repos.post(url, data, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: HttpErrorResponse) => {
                    console.error('❌ Error capturado:');
                    console.error('Status:', error.status);
                    console.error('Mensaje:', error.message);
                    console.error('URL:', error.url);

                    // 🔹 Detectar error de autenticación
                    if (error.status === 401) {
                        console.warn('⚠️ No se pudo autenticar el usuario (401 Unauthorized)');
                        reject({ message: 'No autorizado', code: 401 });
                    } else {
                        // Otros errores (500, 404, etc.)
                        reject(error);
                    }
                }
            });
        });
    }

    public async put<T>(endpoint: string, data: T, api: string): Promise<ResponseModel | null> {
        return new Promise((resolve, reject) => {
            let url = `${endpoint}`;
            this.repos.put(url, data, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: HttpErrorResponse) => {
                    console.error('❌ Error capturado:');
                    console.error('Status:', error.status);
                    console.error('Mensaje:', error.message);
                    console.error('URL:', error.url);

                    // 🔹 Detectar error de autenticación
                    if (error.status === 401) {
                        console.warn('⚠️ No se pudo autenticar el usuario (401 Unauthorized)');
                        reject({ message: 'No autorizado', code: 401 });
                    } else {
                        // Otros errores (500, 404, etc.)
                        reject(error);
                    }
                }
            });
        });
    }

    public async putActivateDeactivate(endpoint: string, id: number, api: string): Promise<ResponseModel | null> {
        return new Promise((resolve, reject) => {
            let url = `${endpoint}/ActivateToDeactivate/${id}`;
            this.repos.put(url, '', api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: HttpErrorResponse) => {
                    console.error('❌ Error capturado:');
                    console.error('Status:', error.status);
                    console.error('Mensaje:', error.message);
                    console.error('URL:', error.url);

                    // 🔹 Detectar error de autenticación
                    if (error.status === 401) {
                        console.warn('⚠️ No se pudo autenticar el usuario (401 Unauthorized)');
                        reject({ message: 'No autorizado', code: 401 });
                    } else {
                        // Otros errores (500, 404, etc.)
                        reject(error);
                    }
                }
            });
        });
    }

    public async delete(endpoint: string, id: number, api: string): Promise<ResponseModel | null> {
        return new Promise((resolve, reject) => {
            let url = `${endpoint}/${id}`;
            this.repos.delete(url, ``, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: HttpErrorResponse) => {
                    console.error('❌ Error capturado:');
                    console.error('Status:', error.status);
                    console.error('Mensaje:', error.message);
                    console.error('URL:', error.url);

                    // 🔹 Detectar error de autenticación
                    if (error.status === 401) {
                        console.warn('⚠️ No se pudo autenticar el usuario (401 Unauthorized)');
                        reject({ message: 'No autorizado', code: 401 });
                    } else {
                        // Otros errores (500, 404, etc.)
                        reject(error);
                    }
                }
            });
        });
    }
}

function reject(arg0: { message: string; code: number; }) {
    throw new Error('Function not implemented.');
}
