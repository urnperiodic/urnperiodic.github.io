import { games as gamesData, ogGames } from './games';
import { GMFILES_PATH_LOOKUP } from './gmfilesPaths';

const ogTitlesSet = new Set(ogGames.map(g => g.title));

const inferPlatformTag = (game) => {
  const rawCategory = typeof game?.category === 'string' ? game.category.trim() : '';
  if (rawCategory && rawCategory.toLowerCase() !== 'emulated') {
    return rawCategory;
  }

  const rawUrl = game?.url || '';
  const mappedUrl = GMFILES_PATH_LOOKUP[rawUrl] || rawUrl;
  const normalizedUrl = String(mappedUrl || '').replace(/^\/+/, '');
  const segments = normalizedUrl.split(/[\\/]+/).filter(Boolean);
  const isPublicGamePath = segments.some(segment => /^(gmfiles|public)$/i.test(segment)) || normalizedUrl.startsWith('gmfiles/');

  if (isPublicGamePath && segments.length > 1) {
    const folderName = segments[segments.length - 2];
    if (folderName && !folderName.includes('.')) {
      return folderName.toLowerCase();
    }
  }

  return rawCategory || 'general';
};

export const games = [...gamesData].map((game, index) => {
  const isOg = Boolean(game.isOg || ogTitlesSet.has(game.title));
  const normalizedGame = {
    ...game,
    category: inferPlatformTag(game),
    isOg
  };

  if (!game.id) {
    const slug = (game.title || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return {
      ...normalizedGame,
      id: `game-gen-${index}-${slug}`
    };
  }

  return normalizedGame;
}).sort((a, b) => {
  const aAi = a.isAiGenerated === true || a.isAiGenerated === 'true';
  const bAi = b.isAiGenerated === true || b.isAiGenerated === 'true';
  if (aAi && !bAi) return 1;
  if (!aAi && bAi) return -1;

  const aFeatured = a.featured === true || a.featured === 'true';
  const bFeatured = b.featured === true || b.featured === 'true';
  if (aFeatured && !bFeatured) return -1;
  if (!aFeatured && bFeatured) return 1;
  return 0;
}).map((game) => ({
  ...game,
  searchText: `${game.title || ''} ${game.description || ''} ${game.category || ''}`.toLowerCase()
}));
