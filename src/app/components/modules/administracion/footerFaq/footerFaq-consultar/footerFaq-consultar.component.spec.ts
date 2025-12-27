import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterFaqConsultarComponent } from './footerFaq-consultar.component';

describe('FooterFaqConsultarComponent', () => {
  let component: FooterFaqConsultarComponent;
  let fixture: ComponentFixture<FooterFaqConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterFaqConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterFaqConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
