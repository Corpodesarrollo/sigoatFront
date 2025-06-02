import { Injectable } from '@angular/core';
import { GenericService } from './generic.services';
import { Permisos } from '../models/permisos.model';
import { apis } from '../models/apis.model';

@Injectable({
  providedIn: 'root'
})
export class MethodsService {
     constructor(
        public repos: GenericService,
    ) { }

    public async getAll<T>(endpoint: string, api: string): Promise<T[] | null> {
        const url = `${endpoint}`;
        return new Promise((resolve) => {
            this.repos.getWithOutParameters(url, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (err) => {
                    console.error(err);
                    resolve(null);
                }
            });
        });
    }
    
    public async get<T>(endpoint: string, id: number, api: string): Promise<T | null>{
        const url = `${endpoint}/${id}`;
        return new Promise((resolve) => {
            this.repos.get(url, ``, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (err) => {
                    console.error(err);
                    resolve(null);
                }
            });
        });
    }

    public async getOnDemand<T>(endpoint: string, page: number, pageSize: number, search: string , api: string): Promise<T | null>{
        const url = `${endpoint}/OnDemand?page=${page}&pageSize=${pageSize}&search=${search}`;
        return new Promise((resolve) => {
            this.repos.get(url, ``, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (err) => {
                    console.error(err);
                    resolve(null);
                }
            });
        });
    }

    public async post<T>(endpoint: string, data: T, api: string): Promise<number | null> {
        return new Promise((resolve) => {
            let url = `${endpoint}`;
            this.repos.post(url, data, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (err) => {
                    console.error(err);
                    resolve(null);
                }
            });
        });
    }

    public async put<T>(endpoint: string, data: T, api: string): Promise<boolean | null> {
        return new Promise((resolve) => {
            let url = `${endpoint}`;
            this.repos.put(url, data, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (err) => {
                    console.error(err);
                    resolve(null);
                }
            });
        });
    }

    public async delete(endpoint: string, id: number, api: string): Promise<boolean | null> {
        return new Promise((resolve) => {
            let url = `${endpoint}/${id}`;
            this.repos.delete(url, ``, api).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (err) => {
                    console.error(err);
                    resolve(null);
                }
            });
        });
    }
}