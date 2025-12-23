import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  setVariable(name: string, value: string) {
    document.documentElement.style.setProperty(name, value);
  }

  getVariable(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
  }
}
