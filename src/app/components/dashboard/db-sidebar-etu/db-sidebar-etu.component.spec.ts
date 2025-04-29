import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbSidebarEtuComponent } from './db-sidebar-etu.component';

describe('DbSidebarEtuComponent', () => {
  let component: DbSidebarEtuComponent;
  let fixture: ComponentFixture<DbSidebarEtuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbSidebarEtuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbSidebarEtuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
