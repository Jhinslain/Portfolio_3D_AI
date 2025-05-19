export interface WikiNodeData {
    name: string;
    description: string;
    links: string[];
  }
  
  export async function fetchWikiSubgraph(
    rootTitle: string,
    maxLinksPerNode = 10,
    maxDepth = 2
  ): Promise<WikiNodeData[]> {
    const visited = new Set<string>();
    const result: WikiNodeData[] = [];
  
    async function fetchNode(title: string, depth: number): Promise<void> {
      if (visited.has(title) || depth > maxDepth) return;
      visited.add(title);
  
      const summaryUrl = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const linksUrl = `https://fr.wikipedia.org/w/api.php?action=query&prop=links&format=json&titles=${encodeURIComponent(title)}&pllimit=${maxLinksPerNode}&origin=*`;
  
      try {
        const [summaryRes, linksRes] = await Promise.all([
          fetch(summaryUrl),
          fetch(linksUrl)
        ]);
  
        if (!summaryRes.ok) {
          console.warn(`❌ Article introuvable ou non accessible : "${title}" (${summaryRes.status})`);
          return;
        }
  
        const summaryData = await summaryRes.json();
        const linksData = await linksRes.json();
  
        const pages = linksData.query?.pages || {};
        const page = Object.values(pages)[0] as any;
  
        if (!page) {
          console.warn(`⚠️ Pas de page trouvée pour "${title}" dans l'API links`);
          return;
        }
  
        const linkedTitles: string[] = (page.links || []).map((l: any) => l.title);
  
        result.push({
          name: summaryData.title,
          description: summaryData.extract || 'Pas de description disponible.',
          links: linkedTitles
        });
  
        if (depth < maxDepth) {
          await Promise.all(
            linkedTitles.slice(0, maxLinksPerNode).map(link => fetchNode(link, depth + 1))
          );
        }
      } catch (err) {
        console.warn(`🚨 Erreur lors de la récupération de "${title}" :`, err);
      }
    }
  
    await fetchNode(rootTitle, 0);
    return result;
  }
  