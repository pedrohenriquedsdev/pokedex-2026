import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, map, switchMap } from 'rxjs';

interface ResultadoObjetoHttp {
  name: string;
  url: string;
}
interface ObjetoRespostaHttp {
  count: number;
  next: string | null;
  previous: string | null;
  results: ResultadoObjetoHttp[];
}

interface TipoPokemonRespostaHttp {
  type: {
    name: string;
  }
}

interface PokemonRespostaHttp {
  id: number;
  name: string;
  type: TipoPokemonRespostaHttp[];
  sprites: {
    front_default: string | null;
  }
}

@Component({
  imports: [],
  selector: 'app-listagem-pokemon',
  styleUrl: './listagem-pokemon.css',
  templateUrl: './listagem-pokemon.html',
})
export class ListagemPokemon {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  protected readonly objetoResposta = toSignal(this.http.get<ObjetoRespostaHttp>(this.apiUrl).pipe(
    switchMap((obj) => {
      const requisicoes = obj.results.map(r => this.http.get<PokemonRespostaHttp>(r.url));

      return forkJoin(requisicoes);
    }),
  ),
    { initialValue: null });
}
