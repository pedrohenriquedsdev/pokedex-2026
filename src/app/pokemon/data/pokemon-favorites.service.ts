import { Injectable, computed, signal } from '@angular/core';
import { PokemonFavorite } from '../pokemon.model';

export const POKEMON_FAVORITES_STORAGE_KEY = 'pokedex:favoritos';

@Injectable({ providedIn: 'root' })
export class PokemonFavoritesService {
  private readonly favoritos = signal<ReadonlyMap<string, PokemonFavorite>>(
    this.carregarFavoritos(),
  );

  readonly lista = computed(() =>
    Array.from(this.favoritos().values()).sort((a, b) => a.id - b.id),
  );

  readonly quantidade = computed(() => this.favoritos().size);

  ehFavorito(nome: string): boolean {
    return this.favoritos().has(nome);
  }

  alternar(pokemon: PokemonFavorite): void {
    const atualizados = new Map(this.favoritos());

    if (atualizados.has(pokemon.name)) {
      atualizados.delete(pokemon.name);
    } else {
      atualizados.set(pokemon.name, pokemon);
    }

    this.favoritos.set(atualizados);
    this.salvarFavoritos(atualizados);
  }

  private carregarFavoritos(): ReadonlyMap<string, PokemonFavorite> {
    try {
      const bruto = localStorage.getItem(POKEMON_FAVORITES_STORAGE_KEY);

      if (!bruto) {
        return new Map();
      }

      const lista = JSON.parse(bruto) as PokemonFavorite[];
      return new Map(lista.map((favorito) => [favorito.name, favorito]));
    } catch {
      return new Map();
    }
  }

  private salvarFavoritos(favoritos: ReadonlyMap<string, PokemonFavorite>): void {
    try {
      localStorage.setItem(
        POKEMON_FAVORITES_STORAGE_KEY,
        JSON.stringify(Array.from(favoritos.values())),
      );
    } catch {
      // LocalStorage indisponível (ex.: aba anônima): favoritos ficam só na sessão atual
    }
  }
}
