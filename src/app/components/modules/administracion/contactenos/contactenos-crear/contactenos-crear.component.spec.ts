import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactenosCrearComponent } from './contactenos-crear.component';

describe('ContactenosCrearComponent', () => {
  let component: ContactenosCrearComponent;
  let fixture: ComponentFixture<ContactenosCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactenosCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactenosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
