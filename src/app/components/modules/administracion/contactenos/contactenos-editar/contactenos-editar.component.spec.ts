import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactenosEditarComponent } from './contactenos-editar.component';

describe('ContactenosEditarComponent', () => {
  let component: ContactenosEditarComponent;
  let fixture: ComponentFixture<ContactenosEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactenosEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactenosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
