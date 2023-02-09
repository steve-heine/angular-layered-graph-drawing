import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependencyNodeManagerComponent } from './dependency-node-manager.component';

describe('DependencyNodeManagerComponent', () => {
  let component: DependencyNodeManagerComponent;
  let fixture: ComponentFixture<DependencyNodeManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DependencyNodeManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DependencyNodeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
