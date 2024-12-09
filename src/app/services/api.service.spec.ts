import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importing the testing module
      providers: [ApiService], 
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the pokemon list', () => {
    const mockData = {
      count: 1,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
      ]
    };

    // Calling the service method
    service.getPokemonList(0, 10).subscribe(data => {
      expect(data.count).toBe(1);
      expect(data.results.length).toBe(1);
      expect(data.results[0].name).toBe('bulbasaur');
    });

    // Expecting a GET request to the correct URL
    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?offset=0&limit=10');
    expect(req.request.method).toBe('GET');

    // Responding with mock data
    req.flush(mockData);
  });

  it('should fetch the details of a pokemon', () => {
    const mockDetails = {
      name: 'bulbasaur',
      sprites: { front_default: 'sprite-url' },
      types: [{ type: { name: 'grass' } }],
      abilities: [{ ability: { name: 'overgrow' } }],
      stats: [{ stat: { name: 'speed' } }]
    };

    // Calling the service method
    service.getPokemonDetails('bulbasaur').subscribe(data => {
      expect(data.name).toBe('bulbasaur');
      expect(data.types[0].type.name).toBe('grass');
      expect(data.abilities[0].ability.name).toBe('overgrow');
      expect(data.stats[0].stat.name).toBe('speed');
    });

    // Expecting a GET request to the correct URL
    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/bulbasaur');
    expect(req.request.method).toBe('GET');

    // Responding with mock data
    req.flush(mockDetails);
  });
});
