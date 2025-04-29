import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbSidebarForComponent } from './db-sidebar-for.component';

describe('DbSidebarForComponent', () => {
  let component: DbSidebarForComponent;
  let fixture: ComponentFixture<DbSidebarForComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbSidebarForComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbSidebarForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
