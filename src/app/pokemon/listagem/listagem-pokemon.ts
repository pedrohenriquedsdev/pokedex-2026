import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonService } from '../data/pokemon.service';
import { Pokemon, PokemonTypeViewModel } from '../pokemon.model';
import { paraTiposViewModel, paraTitleCase } from '../pokemon.util';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { HeroPokebola } from '../../components/hero-pokebola/hero-pokebola';

interface PokemonCardViewModel {
  readonly id: number;
  readonly name: string;
  readonly displayName: string;
  readonly imageUrl: string | null;
  readonly imageAlt: string;
  readonly types: readonly PokemonTypeViewModel[];
}

function paraCardViewModel(dto: Pokemon): PokemonCardViewModel {
  const displayName = paraTitleCase(dto.name);

  return {
    id: dto.id,
    name: dto.name,
    displayName: displayName,
    imageUrl: dto.spriteUrl,
    imageAlt: `Imagem de ${displayName}`,
    types: paraTiposViewModel(dto.types),
  };
}

@Component({
  imports: [RouterLink, HeroPokebola],
  selector: 'app-listagem-pokemon',
  templateUrl: './listagem-pokemon.html',
})
export class ListagemPokemon {
  protected readonly pokemonService = inject(PokemonService);

  protected readonly pokemon = toSignal(
    this.pokemonService.listar().pipe(map((pokemon) => pokemon.map(paraCardViewModel))),
    { initialValue: [] as PokemonCardViewModel[] },
  );
}
