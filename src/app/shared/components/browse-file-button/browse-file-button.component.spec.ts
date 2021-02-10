import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseFileButtonComponent } from './browse-file-button.component';

describe('BrowseFileButtonComponent', () => {
  let component: BrowseFileButtonComponent;
  let fixture: ComponentFixture<BrowseFileButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseFileButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseFileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
