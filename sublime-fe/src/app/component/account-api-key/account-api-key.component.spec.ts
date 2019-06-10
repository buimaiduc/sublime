import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountApiKeyComponent } from './account-api-key.component';

describe('AccountApiKeyComponent', () => {
  let component: AccountApiKeyComponent;
  let fixture: ComponentFixture<AccountApiKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountApiKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountApiKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
