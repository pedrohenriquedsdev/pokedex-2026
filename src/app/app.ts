import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { ListagemPokemon } from './pokemon/listagem/listagem-pokemon';
import { HeroPokebola } from './components/hero-pokebola/hero-pokebola';

@Component({
  imports: [Navbar, HeroPokebola, ListagemPokemon],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App { }
