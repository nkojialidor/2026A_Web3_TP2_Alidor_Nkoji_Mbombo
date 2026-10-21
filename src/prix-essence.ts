import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
@customElement('prix-essence')
export class PrixEssence extends LitElement {

    private etats = [
  { nom: 'New York', code: 'EMM_EPM0_PTE_SNY_DPG' },
  { nom: 'Californie', code: 'EMM_EPM0_PTE_SCA_DPG' },
  { nom: 'Floride', code: 'EMM_EPM0_PTE_SFL_DPG' },
  { nom: 'Colorado', code: 'EMM_EPM0_PTE_SCO_DPG' },
  { nom: 'Massachusetts', code: 'EMM_EPM0_PTE_SMA_DPG' },
  { nom: 'Texas', code: 'EMM_EPM0_PTE_STX_DPG' }
];

@state() 
private etatChoisi: string = 'EMM_EPM0_PTE_SNY_DPG';
@state() 
private dateDebut: string = '2024-01';
@state() 
private dateFin: string = '2024-12';
@state() 
private monnaieChoisie: string = 'CAD';
@state() 
private monnaies: { code: string; nom: string }[] = [];

connectedCallback() {
  super.connectedCallback();
  this.chargerMonnaies();
}

changerEtat(evenement: Event) {
  const liste = evenement.target as HTMLSelectElement;
  this.etatChoisi = liste.value;
  console.log('État choisi :', this.etatChoisi);
}

verifierDates() {
  if (this.dateDebut > this.dateFin) {
    console.log('Erreur : la date de début doit précéder la date de fin');
  } else {
    console.log('Les dates sont valides');
  }
}

changerMonnaie(evenement: Event) {
  const liste = evenement.target as HTMLSelectElement;
  this.monnaieChoisie = liste.value;
  console.log('Monnaie choisie :', this.monnaieChoisie);
}

async chargerMonnaies() {
  const reponse = await fetch(
    'http://localhost:3001/monnaies'
  );

  const donnees = await reponse.json();
  this.monnaies = [];

  for (const code in donnees.symbols) {
    this.monnaies.push({
      code: code,
      nom: donnees.symbols[code]
    });
}

  console.log('Monnaies reçues :', donnees);
}

  render() {
  return html`
    <h2>Évolution des prix de l'essence</h2>

    <label for="etat">Choisir un État américain :</label>

    <select id="etat" @change=${this.changerEtat}>
      ${this.etats.map(etat => html`
        <option value=${etat.code}>
          ${etat.nom}
        </option>
      `)}
    </select>

  <p>
    <label for="debut">Date de début :</label>
    <input
      type="month"
      id="debut"
      value=${this.dateDebut}
      @change=${(evenement: Event) => {
        const champ = evenement.target as HTMLInputElement;
        this.dateDebut = champ.value;
        console.log('Date de début :', this.dateDebut);
      }}
    >
</p>

<p>
  <label for="fin">Date de fin :</label>
  <input
    type="month"
    id="fin"
    value=${this.dateFin}
    @change=${(evenement: Event) => {
      const champ = evenement.target as HTMLInputElement;
      this.dateFin = champ.value;
      console.log('Date de fin :', this.dateFin);
    }}
  >
</p>

<button @click=${this.verifierDates}>
  Vérifier les dates
</button>

<p>
  <label for="monnaie">Choisir une monnaie :</label>

  <select id="monnaie" .value=${this.monnaieChoisie} @change=${this.changerMonnaie}>
  ${this.monnaies.map(monnaie => html`<option value=${monnaie.code}>${monnaie.nom}</option>`)}
  </select>
</p>

  `;
}
}