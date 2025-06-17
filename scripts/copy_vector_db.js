import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function copyVectorDB() {
  try {
    const sourcePath = join(__dirname, 'ghislain_vector_db.json');
    const targetPath = join(__dirname, '..', 'netlify', 'functions', 'ghislain_vector_db.json');

    console.log('📋 Copie de la base vectorielle...');
    await fs.copyFile(sourcePath, targetPath);
    console.log('✅ Base vectorielle copiée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la copie:', error.message);
    process.exit(1);
  }
}

copyVectorDB(); 