import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideHeart } from '@lucide/angular';
import { PokemonFavoritesService } from '../data/pokemon-favorites.service';

@Component({
  imports: [RouterLink, LucideHeart],
  selector: 'app-favoritos-pokemon',
  templateUrl: './favoritos-pokemon.html',
})
export class FavoritosPokemon {
  protected readonly pokemonFavoritesService = inject(PokemonFavoritesService);
}
