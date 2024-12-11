import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss']
})

/**
 * PokemonDetailsComponent component is used to view the details of selected pokemon
 *
 * @export
 * @class PokemonDetailsComponent
 * @typedef {PokemonDetailsComponent}
 * @implements {OnInit}
 */

export class PokemonDetailsComponent implements OnInit {
  pokemon: any = {};
  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {}

  /** 
   * This is used to call the method on page load
   */
  ngOnInit(): void {
    this.fetchDetails()
  }

  /** 
   * fetchDetails method is used to fetch the details from pokemon api with a particular id parameter
   * We are fecthing types, abilities and stats 
   */
  fetchDetails () {
    const name = this.route.snapshot.paramMap.get('id');
    if (name) {
      this.apiService.getPokemonDetails(name).subscribe((data) => {
        this.pokemon = {
          name: data.name,
          sprite: data.sprites.other.dream_world.front_default,
          types: data.types.map((t: any) => t.type.name).join(', '),
          abilities: data.abilities.map((a: any) => a.ability.name).join(', '),
          stats:data.stats.map((s: any) => s.stat.name).join(', ')
        };
        console.log("sprite", this.pokemon.sprite)
      }, (error) => {
        console.error(error)
      });
    }
  }

}
