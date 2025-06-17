import { promises as fs } from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env à la racine
const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: join(rootDir, '.env') });

// Obtenir le chemin du fichier actuel en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const INPUT_FILE = join(__dirname, 'ghislain_embedding_input.json');
const OUTPUT_FILE = join(__dirname, 'ghislain_vector_db.json');
const MODEL = 'text-embedding-3-small';
const BATCH_SIZE = 1; // Nombre d'embeddings à générer en parallèle
const DELAY_BETWEEN_REQUESTS = 100; // Délai en ms entre les requêtes

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateEmbedding(text) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: text,
        model: MODEL
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.data[0].embedding;
  } catch (error) {
    console.error(`❌ Erreur lors de la génération de l'embedding pour le texte: "${text.substring(0, 50)}..."`);
    console.error(`Détails de l'erreur:`, error.response?.data || error.message);
    return null;
  }
}

async function processBatch(items) {
  const results = [];
  for (const item of items) {
    console.log(`🔄 Génération de l'embedding pour ${item.id}...`);
    const embedding = await generateEmbedding(item.text);
    if (embedding) {
      results.push({
        id: item.id,
        text: item.text,
        embedding: embedding
      });
    }
    await sleep(DELAY_BETWEEN_REQUESTS);
  }
  return results;
}

async function main() {
  try {
    // Vérification de la clé API
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non définie dans le fichier .env');
    }

    // Lecture du fichier d'entrée
    console.log('📖 Lecture du fichier d\'entrée...');
    const inputData = JSON.parse(await fs.readFile(INPUT_FILE, 'utf8'));

    // Traitement par lots
    console.log('🚀 Début de la génération des embeddings...');
    const results = [];
    for (let i = 0; i < inputData.length; i += BATCH_SIZE) {
      const batch = inputData.slice(i, i + BATCH_SIZE);
      const batchResults = await processBatch(batch);
      results.push(...batchResults);
    }

    // Sauvegarde des résultats
    console.log('💾 Sauvegarde des résultats...');
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));

    console.log('✅ Vectorisation terminée');
    console.log(`📊 ${results.length}/${inputData.length} embeddings générés avec succès`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main(); 