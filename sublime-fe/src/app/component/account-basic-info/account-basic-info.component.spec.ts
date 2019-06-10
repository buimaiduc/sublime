import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBasicInfoComponent } from './account-basic-info.component';

describe('AccountBasicInfoComponent', () => {
  let component: AccountBasicInfoComponent;
  let fixture: ComponentFixture<AccountBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
