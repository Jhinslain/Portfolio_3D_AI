async function fetchWikiNode(title: string) {
    try {
      const summaryUrl = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const linksUrl = `https://fr.wikipedia.org/w/api.php?action=query&prop=links&format=json&titles=${encodeURIComponent(title)}&pllimit=20&origin=*`;
  
      const [summaryRes, linksRes] = await Promise.all([
        fetch(summaryUrl),
        fetch(linksUrl)
      ]);
  
      const summaryData = await summaryRes.json();
      const linksData = await linksRes.json();
  
      const page = Object.values(linksData.query.pages)[0] as any;
      const linkedTitles = (page.links || []).map((link: any) => link.title);
  
      return {
        name: summaryData.title,
        description: summaryData.extract || 'Pas de description disponible.',
        links: linkedTitles
      };
    } catch (error) {
      console.error("Erreur lors de la récupération de l'article :", error);
      return null;
    }
  }
  