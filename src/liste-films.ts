import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('liste-films')
export class ListeFilms extends LitElement {
static styles = css`
  .image-planete {
    position: relative;
    width: 300px;
  }

  .image-planete img {
    width: 100%;
  }

  .nom-planete {
    position: absolute;
    bottom: 10px;
    left: 8px;
    color: white;
    background-color: black;
    padding: 5px;
  }
`;

@state()
private films: { title: string; planets: string[] }[] = [];
@state()
private planetes: string[] = [];
@state()
private indexPlanete: number = 0;
private _interval?: number;
@state() private vitesse: number = 1000;
@state() private defilementActif: boolean = false;
connectedCallback() {
super.connectedCallback();
this.chargerFilms();
}

disconnectedCallback() {
  super.disconnectedCallback();
  this.arreterDefilement();
}

async chargerFilms() {
const reponse = await fetch('https://swapi.dev/api/films/');
const donnees = await reponse.json();

this.films = donnees.results;
}

async choisirFilm(film: { title: string; planets: string[] }) {
  console.log("Film choisi :", film.title);
  console.log("Planètes du film :", film.planets);

  this.arreterDefilement();
  this.indexPlanete = 0;
  this.planetes = [];

  for (const adresse of film.planets) {
    const reponse = await fetch(adresse);
    const planete = await reponse.json();

    this.planetes = [...this.planetes, planete.name];

    console.log("Nom de la planète :", planete.name);
  }

  window.setTimeout(() => {this.planeteSuivante();
    this.demarrerDefilement();
  }, 1000);
}

arreterDefilement() {
  clearInterval(this._interval);
  this.defilementActif = false;
}

obtenirImagePlanete(nom: string): string {
  if (nom === "Tatooine") {
    return "/planetes/images/tatooine.jpeg";
  }

  if (nom === "Alderaan") {
    return "/planetes/images/alderaan.jpeg";
  }

  if (nom === "Yavin IV") {
    return "/planetes/images/yavin4.jpg";
  }

  if (nom === "Coruscant") {
    return "/planetes/images/coruscant.jpg";
  }

  if (nom === "Dagobah") {
    return "/planetes/images/dagobah.jpg";
  }

  if (nom === "Endor") {
    return "/planetes/images/endor.jpg";
  }

  if (nom === "Naboo") {
    return "/planetes/images/naboo.jpeg";
  }

  return "";
}

planeteSuivante() {
  if (this.indexPlanete < this.planetes.length - 1) {
    this.indexPlanete++;
  } else {
    this.indexPlanete = 0;
  }
}

_tick() {
  this.planeteSuivante();
}

planetePrecedente() {
  if (this.indexPlanete > 0) {
    this.indexPlanete--;
  } else {
    this.indexPlanete = this.planetes.length - 1;
  }
}

demarrerDefilement() {
  this._interval = window.setInterval(() => this._tick(), this.vitesse);
  this.defilementActif = true;
}

changerVitesse(evenement: Event) {
  const liste = evenement.target as HTMLSelectElement;
  this.vitesse = Number(liste.value);

  if (this.defilementActif) {
    this.arreterDefilement();
    this.demarrerDefilement();
  }
}

cliquerSuivant() {
  this.planeteSuivante();

  if (this.defilementActif) {
    this.arreterDefilement();
    this.demarrerDefilement();
  }
}

cliquerPrecedent() {
  this.planetePrecedente();

  if (this.defilementActif) {
    this.arreterDefilement();
    this.demarrerDefilement();
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

        ${this.planetes.length > 0
    ? html`
       <div class="image-planete">
            ${this.obtenirImagePlanete(this.planetes[this.indexPlanete]) !== ""
            ? html`
                <img
                    src=${this.obtenirImagePlanete(this.planetes[this.indexPlanete])}
                    alt=${this.planetes[this.indexPlanete]}
                    width="300"
                >
                `
            : html`<p>Image non disponible</p>`
            }
            ${this.obtenirImagePlanete(this.planetes[this.indexPlanete]) !== ""? html`
                <p class="nom-planete">${this.planetes[this.indexPlanete]}</p>
                `
            : html`
                <p>${this.planetes[this.indexPlanete]}</p>
                `
            }
        </div>
        `
    : html`<p>Aucune planète sélectionnée</p>`
    
    }

    <label for="vitesse">Vitesse :</label>
    <select id="vitesse" @change=${this.changerVitesse}>
        <option value="1500">Lent</option>
        <option value="1000" selected>Moyen</option>
        <option value="500">Rapide</option>
    </select>

    <button @click=${this.cliquerPrecedent}>
        Précédent
    </button>

    <button @click=${this.cliquerSuivant}>
        Suivant
    </button>

    <button @click=${() => {
        if (this.defilementActif) {
            this.arreterDefilement();
        } else {
            this.demarrerDefilement();
        }
        }}>
        ${this.defilementActif ? 'Arrêter' : 'Activer'}
    </button>
    `;
}
}