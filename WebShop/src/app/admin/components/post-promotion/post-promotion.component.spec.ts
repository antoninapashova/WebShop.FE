import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPromotionComponent } from './post-promotion.component';

describe('PostPromotionComponent', () => {
  let component: PostPromotionComponent;
  let fixture: ComponentFixture<PostPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostPromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
