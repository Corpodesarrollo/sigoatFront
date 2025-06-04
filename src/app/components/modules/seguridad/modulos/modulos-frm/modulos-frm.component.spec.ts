import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulosFrmComponent } from './modulos-frm.component';

describe('ModulosFrmComponent', () => {
  let component: ModulosFrmComponent;
  let fixture: ComponentFixture<ModulosFrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulosFrmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulosFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
