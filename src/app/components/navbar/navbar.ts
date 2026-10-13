import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface ItemNavbar {
  titulo: string;
  url: string;
}

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly itensNavbar: ItemNavbar[] = [
    { titulo: 'Início', url: '/pokemon' },
    { titulo: 'Favoritos', url: '/favoritos' },
  ];
}
