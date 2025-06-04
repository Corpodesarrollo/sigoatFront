import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidosEditarComponent } from './contenidos-editar.component';

describe('ContenidosEditarComponent', () => {
  let component: ContenidosEditarComponent;
  let fixture: ComponentFixture<ContenidosEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidosEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
