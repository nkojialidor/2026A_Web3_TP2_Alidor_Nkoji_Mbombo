import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: '.env.local' });
const cleAPI = process.env.APILAYER_API_KEY;
if (cleAPI) {
  console.log('Clé API chargée avec succès');
} else {
  console.log('Erreur : clé API introuvable');
}
const app = express();
const PORT = 3001;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  next();
});

app.get('/test', (req, res) => {
  res.json({ message: 'Le serveur fonctionne' });
});

app.get('/monnaies', async (req, res) => {
  const reponse = await fetch(
    'https://api.apilayer.com/exchangerates_data/symbols',
    {
      headers: {
        apikey: cleAPI
      }
    }
  );

  const donnees = await reponse.json();

  res.json(donnees);
});

app.listen(PORT, () => {
  console.log('Serveur démarré sur le port 3001');
});