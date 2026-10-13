import { TestBed } from '@angular/core/testing';
import { PokemonFavorite } from '../pokemon.model';
import {
  POKEMON_FAVORITES_STORAGE_KEY,
  PokemonFavoritesService,
} from './pokemon-favorites.service';

const PIKACHU: PokemonFavorite = {
  id: 25,
  name: 'pikachu',
  displayName: 'Pikachu',
  number: '#025',
  spriteUrl: null,
  types: [{ name: 'electric', displayName: 'Electric', color: '#F7D02C' }],
};

describe('PokemonFavoritesService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('starts with no favorites when storage is empty', () => {
    const service = TestBed.inject(PokemonFavoritesService);

    expect(service.quantidade()).toBe(0);
    expect(service.ehFavorito('pikachu')).toBe(false);
  });

  it('adds a pokemon as favorite and persists it to localStorage', () => {
    const service = TestBed.inject(PokemonFavoritesService);

    service.alternar(PIKACHU);

    expect(service.ehFavorito('pikachu')).toBe(true);
    expect(service.lista()).toEqual([PIKACHU]);
    expect(JSON.parse(localStorage.getItem(POKEMON_FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([
      PIKACHU,
    ]);
  });

  it('removes a pokemon when toggled a second time', () => {
    const service = TestBed.inject(PokemonFavoritesService);

    service.alternar(PIKACHU);
    service.alternar(PIKACHU);

    expect(service.ehFavorito('pikachu')).toBe(false);
    expect(service.quantidade()).toBe(0);
  });

  it('loads favorites already saved in localStorage on creation', () => {
    localStorage.setItem(POKEMON_FAVORITES_STORAGE_KEY, JSON.stringify([PIKACHU]));

    const service = TestBed.inject(PokemonFavoritesService);

    expect(service.ehFavorito('pikachu')).toBe(true);
    expect(service.quantidade()).toBe(1);
  });
});
