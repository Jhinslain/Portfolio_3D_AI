import { getEmbedding, cosineSimilarity } from '@/services/embedding';

interface WikiPage {
  links?: Array<{ title: string }>;
}

interface WikiResponse {
  query: {
    pages: {
      [key: string]: WikiPage;
    };
  };
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function clean(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\w\s]/gi, '')
    .trim();
}

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function heuristicScore(a: string, b: string): number {
  const cleanA = clean(a);
  const cleanB = clean(b);

  if (cleanA === cleanB) return 100;
  if (cleanA.includes(cleanB)) return 30;
  if (cleanB.includes(cleanA)) return 20;

  const dist = levenshtein(cleanA, cleanB);
  const maxLen = Math.max(cleanA.length, cleanB.length);
  const similarity = 1 - dist / maxLen;

  if (similarity > 0.7) return 15;
  if (similarity > 0.5) return 10;

  return 0;
}

const embeddingCache = new Map<string, number[]>();

export async function findShortestPath(
  start: string,
  target: string,
  maxDepth: number = 6,
  maxLinksPerNode: number = 100,
  onProgress?: (currentNode: string, depth: number) => void
): Promise<string[] | null> {
  const visited = new Set<string>();
  const queue: { title: string; path: string[]; depth: number }[] = [{ title: start, path: [start], depth: 0 }];
  const discoveredNodes: string[] = [start];

  async function fetchAllLinks(title: string, maxLinks = 100): Promise<string[]> {
    let links: string[] = [];
    let plcontinue = '';
    let done = false;

    while (!done && links.length < maxLinks) {
      const url = `https://fr.wikipedia.org/w/api.php?action=query&prop=links&format=json&titles=${encodeURIComponent(title)}&pllimit=max&origin=*${plcontinue ? `&plcontinue=${encodeURIComponent(plcontinue)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json() as WikiResponse;

      const page = Object.values(data.query.pages)[0];
      if (!page?.links) break;

      links.push(...page.links.map(l => l.title));

      if ('continue' in data && 'plcontinue' in (data as any).continue) {
        plcontinue = (data as any).continue.plcontinue;
      } else {
        done = true;
      }
    }

    return shuffle(links).slice(0, maxLinks);
  }

  async function getCachedEmbedding(title: string): Promise<number[]> {
    if (!embeddingCache.has(title)) {
      const vector = await getEmbedding(title);
      embeddingCache.set(title, vector);
    }
    return embeddingCache.get(title)!;
  }

  const targetEmbedding = await getCachedEmbedding(target);

  while (queue.length > 0) {
    const { title, path, depth } = queue.shift()!;
    onProgress?.(title, depth);

    if (visited.has(title) || depth > maxDepth) continue;
    visited.add(title);

    console.log(`🔍 Exploration de "${title}" (profondeur: ${depth})`);
    const links = await fetchAllLinks(title, maxLinksPerNode);
    console.log(`📦 ${links.length} liens trouvés pour "${title}"`);

    const scoredLinks = links.map(link => ({
      link,
      score: heuristicScore(link, target)
    }));

    scoredLinks.sort((a, b) => b.score - a.score);

    console.table(scoredLinks.map(l => ({ link: l.link, score: l.score.toFixed(2) })));

    for (const { link } of scoredLinks) {
      if (visited.has(link)) continue;
      if (link.toLowerCase() === target.toLowerCase()) {
        console.log(`🎯 Cible trouvée: "${link}"`);
        return [...path, link];
      }
      queue.push({ title: link, path: [...path, link], depth: depth + 1 });
      discoveredNodes.push(link);
    }
  }

  return null;
}
