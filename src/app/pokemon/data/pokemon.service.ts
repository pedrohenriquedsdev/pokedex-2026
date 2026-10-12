import { HttpClient } from "@angular/common/http";
import { inject, Injectable, InjectionToken } from "@angular/core";
import { forkJoin, map, switchMap } from "rxjs";
import { ObjetoRespostaHttp, PokemonRespostaHttp } from "./pokemon.dto";
import { Pokemon } from "../pokemon.model";

export const POKE_API_URL = new InjectionToken<string>('POKE_API_URL');

function mapearRespostaPokemon(dto: PokemonRespostaHttp): Pokemon {
  return {
    id: dto.id,
    name: dto.name,
    types: dto.types.map((item) => item.type.name),
    sprite: dto.sprites.front_default,
  }
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
      map((detalhes: PokemonRespostaHttp[]): Pokemon[] =>
        detalhes.map(mapearRespostaPokemon),
      ),
    );
  }
}
