import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { ListagemPokemon } from './components/listagem-pokemon/listagem-pokemon';

@Component({
  imports: [RouterOutlet, Navbar, ListagemPokemon],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
