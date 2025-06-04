import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidosCrearComponent } from './contenidos-crear.component';

describe('ContenidosCrearComponent', () => {
  let component: ContenidosCrearComponent;
  let fixture: ComponentFixture<ContenidosCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidosCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
