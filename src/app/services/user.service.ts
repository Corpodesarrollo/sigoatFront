import { Injectable } from "@angular/core";
import { Parametricas } from "../models/parametricas.model";
import { apis } from "../models/apis.model";
import { GenericService } from "./generic.service";
import { MethodsService } from "./methods.service";

@Injectable({
  providedIn: 'root',
})
export class UsersService extends MethodsService {

    constructor(
        public override repos: GenericService,
    ) { super(repos); }

    async getList(): Promise<Parametricas[]> {
        let response = await this.getAll('users', apis.Seguridad);
        if(!response?.error){
        return response?.data as Parametricas[];
        }
        return [];
    }
}
