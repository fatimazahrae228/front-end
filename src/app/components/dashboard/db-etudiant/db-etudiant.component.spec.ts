import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbEtudiantComponent } from './db-etudiant.component';

describe('DbEtudiantComponent', () => {
  let component: DbEtudiantComponent;
  let fixture: ComponentFixture<DbEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbEtudiantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
