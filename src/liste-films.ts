import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('liste-films')
export class ListeFilms extends LitElement {

@state()
private films: { title: string; planets: string[] }[] = [];
@state()
private planetes: string[] = [];

connectedCallback() {
super.connectedCallback();
this.chargerFilms();
}

async chargerFilms() {
const reponse = await fetch('https://swapi.dev/api/films/');
const donnees = await reponse.json();

this.films = donnees.results;
}

async choisirFilm(film: { title: string; planets: string[] }) {
console.log("Film choisi :", film.title);
console.log("Planètes du film :", film.planets);

this.planetes = [];

for (const adresse of film.planets) {
const reponse = await fetch(adresse);
const planete = await reponse.json();

this.planetes = [...this.planetes, planete.name];

console.log("Nom de la planète :", planete.name);
}
}

render() {
    return html`
    <h2>Liste des films Star Wars Avec Alidor</h2>

    <ul>
        ${this.films.map(film => html`
            <li>
            <button @click=${() => this.choisirFilm(film)}>
                ${film.title}
            </button>
            </li>
        `)}
    </ul>

    <h2>Planètes du film sélectionné</h2>

    <ul>
    ${this.planetes.map(planete => html`
        <li>${planete}</li>
    `)}
    </ul>
    `;
}
}