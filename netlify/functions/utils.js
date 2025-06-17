// Calcul de similarité cosinus
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}

// Fonction pour obtenir les passages les plus pertinents
function getTopPassages(vectorDB, questionVector, topK = 3) {
  const scored = vectorDB.map(p => ({
    ...p,
    score: cosineSimilarity(p.embedding, questionVector)
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(p => p.text);
}

module.exports = {
  cosineSimilarity,
  getTopPassages
}; 