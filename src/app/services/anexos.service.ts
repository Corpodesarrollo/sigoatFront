import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MethodsService } from './methods.service';
import { GenericService } from './generic.service';
import { Menus } from '../models/menus.model';
import { apis } from '../models/apis.model';
import { Parametricas } from '../models/parametricas.model';
import { Carrusel } from '../models/carrusel.model';
import { ResponseModel } from '../models/response.model';
import { Anexos } from '../models/anexos.model';

@Injectable({
  providedIn: 'root'
})
export class AnexosService extends MethodsService {
  private menuCollapsedSource = new BehaviorSubject<boolean>(false);
  currentMenuState = this.menuCollapsedSource.asObservable();

  constructor(
      public override repos: GenericService,
  ) { super(repos); }

  async getList(): Promise<Parametricas[]> {
    let response = await this.getAll('anexos', apis.Administrador);
    if(!response?.error){
      return response?.data as Parametricas[];
    }
    return [];
  }
  
  public async getAllById<T>(endpoint: string, id: number, api: string): Promise<ResponseModel | null> {
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
