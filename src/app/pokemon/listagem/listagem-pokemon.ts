import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonService } from '../data/pokemon.service';
import { Pokemon } from '../pokemon.model';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';

interface PokemonTypeViewModel {
  readonly name: string;
  readonly displayName: string;
}

interface PokemonCardViewModel {
  readonly id: number;
  readonly name: string; // UTILIZAR
  readonly displayName: string;
  readonly imageUrl: string | null;
  readonly imageAlt: string;
  readonly types: readonly PokemonTypeViewModel[];
}

export function paraTitleCase(texto: string): string {
  return texto.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

function paraCardViewModel(dto: Pokemon): PokemonCardViewModel {
  const displayName = paraTitleCase(dto.name)
  const types: PokemonTypeViewModel[] = dto.types.map(type => ({
    name: type,
    displayName: paraTitleCase(type)
  }))

  return {
    id: dto.id,
    name: dto.name,
    displayName: displayName,
    imageUrl: dto.sprite,
    imageAlt: `Imagem de ${displayName}`,
    types: [],
  };
}

@Component({
  imports: [RouterLink],
  selector: 'app-listagem-pokemon',
  templateUrl: './listagem-pokemon.html',
})
export class ListagemPokemon {
  protected readonly pokemonService = inject(PokemonService)

  protected readonly pokemon = toSignal(
    this.pokemonService.listar().pipe(map((pokemon) => pokemon.map(paraCardViewModel))),
    { initialValue: [] as PokemonCardViewModel[] },
  );
}
