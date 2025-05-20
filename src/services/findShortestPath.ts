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
    .replace(/[\d\s\-_]+/g, ' ')
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasNumbers(s: string): boolean {
  return /\d/.test(s);
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
  if (hasNumbers(a) || hasNumbers(b)) return 0;
  const cleanA = clean(a);
  const cleanB = clean(b);
  if (!cleanA || !cleanB) return 0;

  let score = 0;
  if (cleanA === cleanB) score = 100;
  else if (cleanA.includes(cleanB)) score = 30;
  else if (cleanB.includes(cleanA)) score = 20;
  else {
    const dist = levenshtein(cleanA, cleanB);
    const maxLen = Math.max(cleanA.length, cleanB.length);
    const similarity = 1 - dist / maxLen;
    if (similarity > 0.8) score = 25;
    else if (similarity > 0.7) score = 20;
    else if (similarity > 0.6) score = 15;
    else if (similarity > 0.5) score = 10;
    else if (similarity > 0.4) score = 5;
    else if (similarity > 0.3) score = 2;
    else score = 1;

    const wordsA = cleanA.split(/\s+/).filter(word => word.length > 1);
    const wordsB = cleanB.split(/\s+/).filter(word => word.length > 1);
    const commonWords = wordsA.filter(word => wordsB.includes(word));
    if (commonWords.length > 0) {
      score += commonWords.length * 2;
    }
  }

  return score;
}

const embeddingCache = new Map<string, number[]>();

async function fetchAllLinks(title: string, maxLinks = 100): Promise<string[]> {
  let links: string[] = [];
  let plcontinue = '';
  let done = false;

  while (!done && links.length < maxLinks) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const url = new URL('https://fr.wikipedia.org/w/api.php');
      url.searchParams.append('action', 'query');
      url.searchParams.append('prop', 'links');
      url.searchParams.append('format', 'json');
      url.searchParams.append('titles', title);
      url.searchParams.append('pllimit', 'max');
      url.searchParams.append('origin', '*');
      if (plcontinue) url.searchParams.append('plcontinue', plcontinue);

      const res = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'VisualAlchemyPortal/1.0 (https://github.com/yourusername/visual-alchemy-portal; your@email.com)'
        }
      });

      if (!res.ok) {
        if (res.status === 429) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        break;
      }

      const data = await res.json() as WikiResponse;
      const page = Object.values(data.query.pages)[0];
      if (!page?.links) break;
      const filteredLinks = page.links.map(l => l.title).filter(link => !hasNumbers(link));
      links.push(...filteredLinks);

      if ('continue' in data && 'plcontinue' in (data as any).continue) {
        plcontinue = (data as any).continue.plcontinue;
      } else {
        done = true;
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des liens pour "${title}":`, error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return shuffle(links).slice(0, maxLinks);
}

export async function findShortestPath(
  start: string,
  target: string,
  maxDepth: number = 6,
  maxLinksPerNode: number = 50,
  onProgress?: (currentNode: string, depth: number) => void,
  onPathDiscovered?: (node: string, isPathNode: boolean) => Promise<void>
): Promise<string[] | null> {
  if (hasNumbers(start) || hasNumbers(target)) {
    console.warn('⚠️ Les titres ne doivent pas contenir de nombres');
    return null;
  }

  const visited = new Set<string>();
  const queue: { title: string; path: string[]; depth: number; score: number }[] = [
    { title: start, path: [start], depth: 0, score: heuristicScore(target, start) }
  ];
  let bestScore = heuristicScore(target, start);
  let iterationsWithoutImprovement = 0;
  const MAX_ITERATIONS_WITHOUT_IMPROVEMENT = 3;

  while (queue.length > 0) {
    queue.sort((a, b) => b.score - a.score);
    const { title, path, depth, score } = queue.shift()!;
    onProgress?.(title, depth);
    if (onPathDiscovered) await onPathDiscovered(title, false);

    if (visited.has(title) || depth > maxDepth) continue;
    visited.add(title);

    console.log(`🔍 Exploration de "${title}" (profondeur: ${depth}, score: ${score})`);
    const links = await fetchAllLinks(title, maxLinksPerNode);
    console.log(`📦 ${links.length} liens trouvés pour "${title}"`);

    const scoredLinks = links
      .filter(link => !visited.has(link))
      .map(link => ({
        link,
        score: heuristicScore(target, link)
      }))
      .sort((a, b) => b.score - a.score);

    const topLinks = scoredLinks.slice(0, 5);
    let foundBetterScore = false;

    for (const { link, score: linkScore } of topLinks) {
      if (link.toLowerCase() === target.toLowerCase()) {
        console.log(`🎯 Cible trouvée: "${link}"`);
        if (onPathDiscovered) {
          for (const node of [...path, link]) {
            await onPathDiscovered(node, true);
          }
        }
        return [...path, link];
      }

      if (linkScore > bestScore) {
        bestScore = linkScore;
        foundBetterScore = true;
        iterationsWithoutImprovement = 0;
        console.log(`✨ Nouveau meilleur score: ${bestScore} pour "${link}"`);
      }

      queue.push({ title: link, path: [...path, link], depth: depth + 1, score: linkScore });
    }

    if (!foundBetterScore) {
      iterationsWithoutImprovement++;
      if (iterationsWithoutImprovement >= MAX_ITERATIONS_WITHOUT_IMPROVEMENT) {
        const additionalLinks = scoredLinks.slice(5, 10);
        for (const { link, score: linkScore } of additionalLinks) {
          queue.push({ title: link, path: [...path, link], depth: depth + 1, score: linkScore });
        }
        iterationsWithoutImprovement = 0;
      }
    }
  }

  return null;
}
