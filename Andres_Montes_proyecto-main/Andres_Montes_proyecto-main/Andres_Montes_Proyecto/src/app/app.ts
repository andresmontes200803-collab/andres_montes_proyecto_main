import { Component, signal } from '@angular/core';
import { Prestamos } from './prestamos/prestamos';


@Component({
  imports: [Prestamos],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
 
}
