export const getShortDateISOString = (date: Date) =>
  date.toISOString().substring(0, date.toISOString().search('T'));

export const getIconPicture = (images: SpotifyApi.ImageObject[]): string => {
  let picture = '';
  if (images.length > 0) {
    images
      .slice()
      .reverse()
      .forEach((image) => {
        if (
          picture === '' &&
          image.height &&
          image.height > 159 &&
          image.width &&
          image.width > 159
        ) {
          picture = image.url;
        }
      });
    if (picture === '') {
      picture = images[0].url;
    }
  }
  return picture;
};

export const getBigPicture = (images: SpotifyApi.ImageObject[]): string => {
  return images.length > 0 ? images[0].url : '';
};

export const displayedLocationName = (location: string): string => {
  return location.search('United States of America') !== -1
    ? location.replace('United States of America', 'United States')
    : location;
};

export const getMaxArtistsInWidth = (
  bigScreen: boolean,
  smallScreen: boolean,
  maxBigScreen: number
) => {
  const vw = Math.min(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const outerMargin = smallScreen ? 32 : 64;
  return bigScreen
    ? Math.min(maxBigScreen, Math.floor((vw - outerMargin) / 100))
    : Math.max(3, Math.floor((vw - outerMargin) / 75));
};

export const getMaxArtistsInFullLineupWidth = (
  bigScreen: boolean,
  smallScreen: boolean,
  maxBigScreen: number
) => {
  const vw = Math.min(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const outerMargin = smallScreen ? 16 : 32;
  return bigScreen
    ? Math.min(maxBigScreen, Math.floor((0.99 * (vw - outerMargin)) / 100))
    : Math.max(3, Math.floor((0.99 * (vw - outerMargin)) / 75));
};

export const getBaseUrl = () => {
  const url = window.location.href;
  const spotifest_pos = url.search('spotifest.app');
  if (spotifest_pos !== -1) {
    return url.slice(0, spotifest_pos) + 'spotifest.app';
  } else {
    const localhost_pos = url.search('localhost:3000');
    return url.slice(0, localhost_pos) + 'localhost:3000';
  }
};

export const getArtistPath = (artistName: string, spotifyId?: string) => {
  if (spotifyId) return `/artist/spotifyId=${spotifyId}`;
  return '/artist/' + encodeURIComponent(artistName);
};

export const getFestivalPath = (festivalName: string) =>
  '/festival/' + encodeURIComponent(festivalName);

export const getArtistUrl = (artistName: string, spotifyId?: string) =>
  getBaseUrl() + getArtistPath(artistName, spotifyId);

export const getFestivalUrl = (festivalName: string) =>
  getBaseUrl() + getFestivalPath(festivalName);
