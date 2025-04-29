import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbSidebarComponent } from './db-sidebar.component';

describe('DbSidebarComponent', () => {
  let component: DbSidebarComponent;
  let fixture: ComponentFixture<DbSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
