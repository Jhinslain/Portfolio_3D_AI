const linkCache = new Map<string, string[]>();

async function getLinks(title: string): Promise<string[]> {
  if (linkCache.has(title)) return linkCache.get(title)!;
  const links = await fetchAllLinks(title);
  linkCache.set(title, links);
  return links;
}

interface WikipediaPage {
  links?: Array<{ title: string }>;
}

interface WikipediaResponse {
  query: {
    pages: {
      [key: string]: WikipediaPage;
    };
  };
  continue?: {
    plcontinue: string;
  };
}

function shouldExcludeLink(link: string): boolean {
  const excludedPatterns = [
    /^Catégorie:/,
    /^Aide:/,
    /^Modèle:/,
    /^Portail:/,
    /^Projet:/,
    /^Wikipédia:/,
    /^Fichier:/,
    /^Discussion:/,
    /^Spécial:/,
    /^Utilisateur:/,
    /^Module:/,
    /^MediaWiki:/,
    /^Homonymie$/
  ];

  return excludedPatterns.some(pattern => pattern.test(link));
}

async function fetchAllLinks(title: string, maxLinks = 100): Promise<string[]> {
  let links: string[] = [];
  let plcontinue = '';
  let done = false;

  while (!done && links.length < maxLinks) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const url = new URL('https://fr.wikipedia.org/w/api.php');
      url.searchParams.append('action', 'query');
      url.searchParams.append('prop', 'links');
      url.searchParams.append('format', 'json');
      url.searchParams.append('titles', title);
      url.searchParams.append('pllimit', 'max');
      url.searchParams.append('origin', '*');
      if (plcontinue) url.searchParams.append('plcontinue', plcontinue);

      const res = await fetch(url.toString());
      if (!res.ok) break;

      const data = await res.json() as WikipediaResponse;
      const page = Object.values(data.query.pages)[0];
      if (!page?.links) break;

      links.push(
        ...page.links
          .map(l => l.title)
          .filter(link => !/\d/.test(link) && !shouldExcludeLink(link)) // ignore liens avec chiffres et pages spéciales
      );

      if (data.continue?.plcontinue) {
        plcontinue = data.continue.plcontinue;
      } else {
        done = true;
      }
    } catch (err) {
      console.warn(`⚠️ Erreur fetchAllLinks pour ${title}`, err);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return links.slice(0, maxLinks);
}

function reconstructPath(
  meetNode: string,
  parentFromStart: Map<string, string>,
  parentFromEnd: Map<string, string>
): string[] {
  const pathStart: string[] = [];
  let node: string | undefined = meetNode;
  while (node) {
    pathStart.unshift(node);
    node = parentFromStart.get(node);
  }

  const pathEnd: string[] = [];
  node = parentFromEnd.get(meetNode);
  while (node) {
    pathEnd.push(node);
    node = parentFromEnd.get(node);
  }

  return [...pathStart, ...pathEnd];
}

export async function bidirectionalSearch(
  start: string,
  target: string,
  maxDepth = 6,
  onProgress?: (currentNode: string, depth: number, side: 'start' | 'end') => void,
  onPathDiscovered?: (node: string, isPathNode: boolean) => Promise<void>
): Promise<string[] | null> {
  if (start.toLowerCase() === target.toLowerCase()) {
    if (onPathDiscovered) await onPathDiscovered(start, true);
    return [start];
  }

  const visitedFromStart = new Set<string>([start]);
  const visitedFromEnd = new Set<string>([target]);

  const queueStart = [start];
  const queueEnd = [target];

  const parentFromStart = new Map<string, string>();
  const parentFromEnd = new Map<string, string>();

  for (let depth = 0; depth < maxDepth; depth++) {
    const processQueue = async (
      queue: string[],
      visitedThisSide: Set<string>,
      visitedOtherSide: Set<string>,
      parentThisSide: Map<string, string>,
      parentOtherSide: Map<string, string>,
      side: 'start' | 'end'
    ): Promise<string | null> => {
      const nextLevel: string[] = [];

      for (const node of queue) {
        onProgress?.(node, depth, side);
        console.log(`🔍 Exploration ${side === 'start' ? 'depuis le début' : 'depuis la fin'}: "${node}" (profondeur: ${depth})`);
        
        const links = await getLinks(node);
        console.log(`📦 ${links.length} liens trouvés pour "${node}"`);

        for (const link of links) {
          if (visitedThisSide.has(link)) continue;
          visitedThisSide.add(link);
          parentThisSide.set(link, node);

          if (visitedOtherSide.has(link)) {
            console.log(`🎯 Point de rencontre trouvé: "${link}"`);
            console.log(`🔄 Reconstruction du chemin à partir de "${link}"...`);
            return link;
          }

          nextLevel.push(link);
        }
      }

      queue.length = 0;
      queue.push(...nextLevel);
      return null;
    };

    const meetFromStart = await processQueue(
      queueStart,
      visitedFromStart,
      visitedFromEnd,
      parentFromStart,
      parentFromEnd,
      'start'
    );
    if (meetFromStart) {
      const path = reconstructPath(meetFromStart, parentFromStart, parentFromEnd);
      if (onPathDiscovered) {
        console.log('🎨 Mise en surbrillance du chemin trouvé...');
        for (const node of path) {
          await onPathDiscovered(node, true);
        }
      }
      return path;
    }

    const meetFromEnd = await processQueue(
      queueEnd,
      visitedFromEnd,
      visitedFromStart,
      parentFromEnd,
      parentFromStart,
      'end'
    );
    if (meetFromEnd) {
      const path = reconstructPath(meetFromEnd, parentFromStart, parentFromEnd);
      if (onPathDiscovered) {
        console.log('🎨 Mise en surbrillance du chemin trouvé...');
        for (const node of path) {
          await onPathDiscovered(node, true);
        }
      }
      return path;
    }
  }

  return null;
}
