import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

import { ApiService } from '../services/api.service';

/**
 * This component is used to load the data from pokemon api
 * Store the data in dataSource
 * Display the list in a table
 *
 * @export
 * @class PokemonListComponent
 * @typedef {PokemonListComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'types', 'sprite'];
  dataSource = new MatTableDataSource<any>()
  filteredDataSource = new MatTableDataSource<any>()
  totalCount = 0;
  pageSize = 10;
  searchQuery:string = '';
  selectedType: string | null = null;
  types: string[] = [];
  offset = 0;

  constructor(private apiService: ApiService, private router: Router) {}

  /** 
   * This is the place where api is being called.
   */
  ngOnInit(): void {
    this.fetchData();
  }

  /** 
   * FetchData method is used to fetch the pokemon list from pokemon api
   * it returns void
   * it saves ID, name, Types and Sprites
   * */
  fetchData(): void {
      this.apiService.getPokemonList(this.offset, this.pageSize).subscribe({
        next: (data) => {
          this.totalCount = data.count;
  
          // Map the results and make additional API calls for each Pokemon
          const pokemonRequests: Observable<any>[] = data.results.map((pokemon: any) =>
           this.apiService.getPokemonDetails(pokemon.name)
          );
  
          // Use forkJoin to fetch details for all Pokemon
          forkJoin(pokemonRequests).subscribe({
            next: (pokemonDetails: any[]) => {
              this.dataSource.data = pokemonDetails.map((details) => ({
                id: details.id,
                name: details.name,
                sprite: details.sprites.front_default,
                types: details.types.map((t: any) => t.type.name).join(', '),
              }));
              let types: any[] = []
              this.filteredDataSource.data = this.dataSource.data;
              this.dataSource.data.filter((poke) => {
                types.push(poke.types)
              })
              const properArray = types
              .map(item => item.split(',').map((type: string) => type.trim())).flat(); 
              this.types = [...new Set(properArray)]
            },
            error: (error) => {
              console.error('Error fetching Pokémon details:', error);
            }
          });
      }});
  }

  /**
   * OnPageChange will be triggered while changing the page using pagination
   *
   * @param {*} event
   */
  onPageChange(event: any): void {
    this.offset = event.pageIndex * this.pageSize;
    this.fetchData();
  }

  /** 
   * filterByName method is used to filter the data based on pokemon name
   */
  filterByName(): void {
    this.applyFilter()
  }

  /**
   * This method is used to filter by type
   *
   * @param {*} event
   */
  filterByType(event:any) {
    this.selectedType = event.value
    this.applyFilter()
  }

  /** 
   * filter by type and search by name logics
   */
  applyFilter() {
    let filterData = this.dataSource.data;
    if(this.searchQuery) {
      filterData = filterData.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(this.searchQuery?.toLowerCase())
      })
    }
    if(this.selectedType) {
      filterData = filterData.filter((pokemon) => {
        return pokemon.types.split(',').includes(this.selectedType)
      })
    }
    this.filteredDataSource.data = filterData
  }

  /**
   * pokemonDetailsPage method to navigate to Details page
   * This method is created to perform click on row
   *
   * @param {*} pokemon
   */
  pokemonDetailsPage(pokemon:any) {
    this.router.navigate(['/pokemon', pokemon.name])
  }

}
