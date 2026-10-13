import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { HeroPokebola } from './components/hero-pokebola/hero-pokebola';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [Navbar, RouterOutlet, HeroPokebola],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
