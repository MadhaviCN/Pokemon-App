import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonListComponent } from './pokemon-list.component';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FormsModule } from '@angular/forms';

const mockApiService = {
  getPokemonList: jasmine.createSpy().and.returnValue(of({
    count: 2,
    results: [
      { name: 'bulbasaur', sprites: { front_default: 'bulbasaur_sprite' }, types: [{ type: { name: 'grass' } }] },
      { name: 'ivysaur', sprites: { front_default: 'ivysaur_sprite' }, types: [{ type: { name: 'poison' } }] },
    ]
  }))
};

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let apiService: ApiService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonListComponent ],
      imports: [MatTableModule, MatPaginatorModule, MatInputModule, RouterTestingModule, BrowserAnimationsModule, FormsModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'bulbasaur' } } } },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiService = TestBed.inject(ApiService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(apiService.getPokemonList).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(0);
  });

  it('should fetch new data when pagination changes', () => {
    fixture.detectChanges();
    spyOn(component, 'fetchData').and.callThrough();
    const paginator = fixture.nativeElement.querySelector('mat-paginator');
    paginator.dispatchEvent(new Event('page'));
    expect(component.fetchData).toHaveBeenCalled();
  });

  it('should navigate to the detail page of a Pokémon', () => {
    fixture.detectChanges();
    const pokemon = { name: 'bulbasaur' };
    component.pokemonDetailsPage(pokemon);
    expect(router.navigate).toHaveBeenCalledWith(['/pokemon', 'bulbasaur']);
  });
});
