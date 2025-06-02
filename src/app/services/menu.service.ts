import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MethodsService } from './methods.service';
import { GenericService } from './generic.services';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends MethodsService {
  private menuCollapsedSource = new BehaviorSubject<boolean>(false);
  currentMenuState = this.menuCollapsedSource.asObservable();

  constructor(
      public override repos: GenericService,
  ) { super(repos); }

  toggleMenu() {
    this.menuCollapsedSource.next(!this.menuCollapsedSource.getValue());
  }
}
