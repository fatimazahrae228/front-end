import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbFormateurComponent } from './db-formateur.component';

describe('DbFormateurComponent', () => {
  let component: DbFormateurComponent;
  let fixture: ComponentFixture<DbFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbFormateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
