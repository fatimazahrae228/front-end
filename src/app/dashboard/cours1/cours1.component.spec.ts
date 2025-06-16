import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cours1Component } from '../../components/dashboard/cours1/cours1.component';



describe('Cours1Component', () => {
  let component: Cours1Component;
  let fixture: ComponentFixture<Cours1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cours1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cours1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
