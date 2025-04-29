import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnecterComponent } from './connecter.component';

describe('ConnecterComponent', () => {
  let component: ConnecterComponent;
  let fixture: ComponentFixture<ConnecterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnecterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnecterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
