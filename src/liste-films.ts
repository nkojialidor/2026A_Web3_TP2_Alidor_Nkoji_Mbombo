import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('liste-films')
export class ListeFilms extends LitElement {

  @state()
  private films: { title: string; planets: string[] }[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.chargerFilms();
  }

  async chargerFilms() {
    const reponse = await fetch('https://swapi.dev/api/films/');
    const donnees = await reponse.json();

    this.films = donnees.results;
  }

  render() {
    return html`
      <h2>Liste des films Star Wars Avec Alidor</h2>

      <ul>
        ${this.films.map(film => html`
          <li>${film.title}</li>
        `)}
      </ul>
    `;
  }
}