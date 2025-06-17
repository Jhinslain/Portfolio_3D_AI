const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { getTopPassages } = require('./utils');

// Chemin absolu vers la base vectorielle, basé sur le dossier racine du projet
const vectorDBPath = path.join(process.cwd(), 'netlify', 'functions', 'ghislain_vector_db.json');

exports.handler = async function(event, context) {
  console.log('Fonction appelée avec:', event.body);

  if (event.httpMethod !== 'POST') {
    console.log('Méthode non autorisée:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    // Charger la base vectorielle
    let vectorDB;
    try {
      vectorDB = JSON.parse(await fs.readFile(vectorDBPath, 'utf-8'));
    } catch (error) {
      console.error('Erreur lors du chargement de la base vectorielle:', error);
      vectorDB = [];
    }

    const { question } = JSON.parse(event.body);
    console.log('Question reçue:', question);

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY non configurée');
      throw new Error('OPENAI_API_KEY non configurée');
    }

    // 1. Générer l'embedding de la question
    console.log('🔄 Génération de l\'embedding de la question...');
    const embeddingRes = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: question,
        model: 'text-embedding-3-small'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const questionVector = embeddingRes.data.data[0].embedding;

    // 2. Trouver les passages les plus pertinents
    console.log('🔍 Recherche des passages pertinents...');
    const relevantPassages = getTopPassages(vectorDB, questionVector);
    const context = relevantPassages.join('\n\n');

    // 3. Générer la réponse avec GPT
    console.log('🤖 Génération de la réponse...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Tu es l'assistant de Ghislain LEVREAU. Voici des informations pertinentes extraites de ses données :\n\n${context}\n\nRéponds à la question en te basant uniquement sur ces informations. Si la réponse n'est pas dans ces informations, dis-le honnêtement.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.5,
        max_tokens: 150,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
        top_p: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Réponse générée avec succès');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        reply: response.data.choices[0].message.content 
      })
    };
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: error.response?.data?.error?.message || 'Une erreur est survenue lors de la communication avec OpenAI'
      })
    };
  }
};
