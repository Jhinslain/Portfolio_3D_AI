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

export async function findShortestPath(
    start: string,
    target: string,
    maxDepth: number = 6,
    maxLinksPerNode: number = 100,
    onProgress?: (currentNode: string, depth: number) => void
  ): Promise<string[] | null> {
    const visited = new Set<string>();
    const queue: { title: string; path: string[]; depth: number }[] = [{ title: start, path: [start], depth: 0 }];
    const discoveredNodes: string[] = [start]; // Pour garder l'ordre de découverte
  
    async function fetchLinks(title: string): Promise<string[]> {
      const url = `https://fr.wikipedia.org/w/api.php?action=query&prop=links&format=json&titles=${encodeURIComponent(
        title
      )}&pllimit=${maxLinksPerNode}&origin=*`;
      try {
        const res = await fetch(url);
        const data = await res.json() as WikiResponse;
        const pages = Object.values(data.query.pages);
        if (!pages.length || !pages[0].links) return [];
        return pages[0].links.map(l => l.title);
      } catch (e) {
        console.warn(`Erreur lors de la récupération des liens pour ${title}`, e);
        return [];
      }
    }
  
    while (queue.length > 0) {
      const { title, path, depth } = queue.shift()!;
      
      // Appeler le callback de progression
      onProgress?.(title, depth);
      
      if (visited.has(title) || depth > maxDepth) continue;
      visited.add(title);
  
      console.log(`🔍 Exploration de "${title}" (profondeur: ${depth})`);
      const links = await fetchLinks(title);
      console.log(`📦 ${links.length} liens trouvés pour "${title}"`);
  
      // Mélanger les liens pour éviter un ordre alphabétique
      const shuffledLinks = links.sort(() => Math.random() - 0.5);
  
      for (const link of shuffledLinks) {
        if (visited.has(link)) continue;
        if (link.toLowerCase() === target.toLowerCase()) {
          console.log(`🎯 Cible trouvée: "${link}"`);
          return [...path, link];
        }
        queue.push({ title: link, path: [...path, link], depth: depth + 1 });
        discoveredNodes.push(link); // Ajouter le nœud dans l'ordre de découverte
      }
    }
  
    return null; // Aucun chemin trouvé
  }
  