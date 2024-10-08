import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonShowComponent } from './pokemon-show.component';

describe('PokemonShowComponent', () => {
  let component: PokemonShowComponent;
  let fixture: ComponentFixture<PokemonShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
