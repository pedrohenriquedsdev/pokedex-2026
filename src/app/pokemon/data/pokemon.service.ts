import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { forkJoin, map, switchMap } from 'rxjs';
import {
  ObjetoRespostaHttp,
  PokemonDetalhesRespostaHttp,
  PokemonRespostaHttp,
} from './pokemon.dto';
import { Pokemon, PokemonDetails } from '../pokemon.model';

export const POKE_API_URL = new InjectionToken<string>('POKE_API_URL');

function mapearRespostaPokemon(dto: PokemonRespostaHttp): Pokemon {
  return {
    id: dto.id,
    name: dto.name,
    types: dto.types.map((item) => item.type.name),
    spriteUrl: dto.sprites.front_default,
  };
}

function mapearRespostaPokemonDetalhes(dto: PokemonDetalhesRespostaHttp): PokemonDetails {
  return {
    ...mapearRespostaPokemon(dto),
    imageUrl: dto.sprites.other?.['official-artwork']?.front_default ?? null,
    audioUrl: dto.cries?.latest ?? null,
    height: dto.height,
    weight: dto.weight,
    abilities: dto.abilities.map((item) => item.ability.name),
    stats: dto.stats.map((item) => ({ name: item.stat.name, baseValue: item.base_stat })),
  };
}

@Injectable({ providedIn: 'root' }) // UMA ÚNICA INSTÂNCIA: Auto um service
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(POKE_API_URL);

  listar() {
    return this.http.get<ObjetoRespostaHttp>(this.apiUrl).pipe(
      switchMap((obj) => {
        const requisicoes = obj.results.map((r) => this.http.get<PokemonRespostaHttp>(r.url));

        return forkJoin(requisicoes);
      }),
      map((detalhes: PokemonRespostaHttp[]): Pokemon[] => detalhes.map(mapearRespostaPokemon)),
    );
  }

  buscarPorNome(nome: string) {
    return this.http
      .get<PokemonDetalhesRespostaHttp>(`${this.apiUrl}${nome}`)
      .pipe(map(mapearRespostaPokemonDetalhes));
  }

  buscarPorId(id: number) {
    return this.http
      .get<PokemonDetalhesRespostaHttp>(`${this.apiUrl}${id}`)
      .pipe(map(mapearRespostaPokemonDetalhes));
  }
}
