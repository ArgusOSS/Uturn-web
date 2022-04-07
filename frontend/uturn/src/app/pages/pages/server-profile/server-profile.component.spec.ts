import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerProfileComponent } from './server-profile.component';

describe('ServerProfileComponent', () => {
  let component: ServerProfileComponent;
  let fixture: ComponentFixture<ServerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
