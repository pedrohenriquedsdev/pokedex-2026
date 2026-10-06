import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

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
    // No pipe executamos functions => Operadores (modificam o objeto inicial em relação ao que pedimos na pipe de req)
    map((obj) => {
      // Map = Select do C#
      return obj.results.map((r) => r.name.toUpperCase());
    }), // gera outras observables a partir da observable inicial
  ),
    { initialValue: null });
}
