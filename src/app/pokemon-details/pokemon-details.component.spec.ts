import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetailsComponent } from './pokemon-details.component';
import { ApiService } from '../services/api.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


describe('PokemonDetailsComponent', () => {
  let component: PokemonDetailsComponent;
  let fixture: ComponentFixture<PokemonDetailsComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getPokemonDetails']);
    apiServiceSpy.getPokemonDetails.and.returnValue(of({}));
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('bulbasaur'), // Mock Pokémon name
        },
      },
    };
    await TestBed.configureTestingModule({
      declarations: [ PokemonDetailsComponent ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch Pokémon details on init', () => {
    const mockPokemonData = {
      name: 'bulbasaur',
      sprites: { front_default: 'bulbasaur_sprite_url' },
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      abilities: [{ ability: { name: 'overgrow' } }, { ability: { name: 'chlorophyll' } }],
      stats: [{ stat: { name: 'speed' } }, { stat: { name: 'attack' } }],
    };
    apiServiceSpy.getPokemonDetails.and.returnValue(of(mockPokemonData));

    component.ngOnInit();

    expect(apiServiceSpy.getPokemonDetails).toHaveBeenCalledWith('bulbasaur');
    expect(component.pokemon).toEqual({
      name: 'bulbasaur',
      sprite: 'bulbasaur_sprite_url',
      types: 'grass,poison',
      abilities: 'overgrow,chlorophyll',
      stats: 'speed,attack',
    });
  });

  it('should handle API errors gracefully', () => {
    spyOn(console, 'error');
    apiServiceSpy.getPokemonDetails.and.returnValue(throwError(() => new Error('API error')));
    component.ngOnInit();
    expect(apiServiceSpy.getPokemonDetails).toHaveBeenCalledWith('bulbasaur');
    expect(component.pokemon).toEqual({});
    expect(console.error).toHaveBeenCalledWith(new Error('API error'));
  });
});
