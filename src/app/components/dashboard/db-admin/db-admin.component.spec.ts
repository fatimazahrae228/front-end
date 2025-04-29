import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbAdminComponent } from './db-admin.component';

describe('DbAdminComponent', () => {
  let component: DbAdminComponent;
  let fixture: ComponentFixture<DbAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
