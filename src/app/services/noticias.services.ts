import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MethodsService } from './methods.services';
import { GenericService } from './generic.services';
import { apis } from '../models/apis.model';
import { Parametricas } from '../models/parametricas.model';
import { ResponseModel } from '../models/response.model';
import { Noticias } from '../models/noticias.model';

@Injectable({
  providedIn: 'root'
})
export class NoticiasServices extends MethodsService {
  private menuCollapsedSource = new BehaviorSubject<boolean>(false);
  currentMenuState = this.menuCollapsedSource.asObservable();

  constructor(
      public override repos: GenericService,
  ) { super(repos); }

  async getList(): Promise<Parametricas[]> {
    let response = await this.getAll<Noticias>('noticias', apis.Seguridad);
    if(!response?.error){
      return response?.data as Parametricas[];
    }
    return [];
  }
  
  public async getAllById(endpoint: string, id: number, api: string): Promise<ResponseModel | null> {
      const url = `${endpoint}/getAllById/${id}`;
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

  public async putUpDown(endpoint: string, data: string, api: string): Promise<ResponseModel | null> {
    return new Promise((resolve) => {
        const url = `${endpoint}/UpDown/${data}`;
        this.repos.put(url, null, api).subscribe({
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
