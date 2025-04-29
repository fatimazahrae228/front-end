import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbNavbarComponent } from './db-navbar.component';

describe('DbNavbarComponent', () => {
  let component: DbNavbarComponent;
  let fixture: ComponentFixture<DbNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
