import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { ListagemPokemon } from './components/listagem-pokemon/listagem-pokemon';

@Component({
  imports: [Navbar, ListagemPokemon],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
