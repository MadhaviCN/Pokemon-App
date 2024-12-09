import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

/**
 * Apis are created to fetch pokemon list and details
 *
 * @export
 * @class ApiService
 * @typedef {ApiService}
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  /**
   * To fetch the list with offset and limit  - these 2 parameters are used for pagination
   *
   * @param {number} offset
   * @param {number} limit
   * @returns {Observable<any>}
   */
  getPokemonList(offset: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pokemon?offset=${offset}&limit=${limit}`).pipe(
      catchError((error) => {
        console.log("error", error)
        throw error
      })
    );
  }

  /**
   * This method id used to fetch the details by using id parameter
   *
   * @param {string} name
   * @returns {Observable<any>}
   */
  getPokemonDetails(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pokemon/${name}`).pipe(
      catchError((error) => {
        console.log("error", error)
        throw error
      })
    );
  }
}