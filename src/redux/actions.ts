import { Action, ActionTypeKeys, Dispatch, Artist, MatchRequest, FestivalMatch, Area, Lineup, MatchingMethod, UserInfo, Playlist } from "./types";
import { fetchToJson } from "../utils/restUtils";
import countries_list from 'countries-list/dist/data.json';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

export const turnOnLoader = (): Action => {
    return {
        type: ActionTypeKeys.TURN_ON_LOADER
    }
};

export const turnOffLoader = (): Action => {
    return {
        type: ActionTypeKeys.TURN_OFF_LOADER
    }
};

export const setLoggedIn = (): Action => {
    return {
        type: ActionTypeKeys.SET_LOGGED_IN
    }
};

export const setLoggedOff = (): Action => {
    return {
        type: ActionTypeKeys.SET_LOGGED_OFF
    }
};

export const switchToDarkMode = (): Action => {
    return {
        type: ActionTypeKeys.SWITCH_TO_DARK_MODE,
    }
};

export const switchToLightMode = (): Action => {
    return {
        type: ActionTypeKeys.SWITCH_TO_LIGHT_MODE,
    }
};

export const setUserInfo = (info: UserInfo): Action => {
    return {
        type: ActionTypeKeys.SET_USER_INFO,
        info: info
    }
};

export const setTopArtists = (artists: Artist[]): Action => {
    return {
        type: ActionTypeKeys.SET_TOP_ARTISTS,
        artists: artists
    }
};

export const setPlaylists = (playlists: Playlist[]): Action => {
    return {
        type: ActionTypeKeys.SET_PLAYLISTS,
        playlists: playlists
    }
};

export const addCountries = (countries: Area[]): Action => {
    return {
        type: ActionTypeKeys.ADD_COUNTRIES,
        countries: countries
    }
};

export const addContinents = (continents: Area[]): Action => {
    return {
        type: ActionTypeKeys.ADD_CONTINENTS,
        continents: continents
    }
};

export const addFestivalMatch = (festival: FestivalMatch): Action => {
    return {
        type: ActionTypeKeys.ADD_FESTIVAL_MATCH,
        festival: festival
    }
};

export const addFestivalMatches = (festivals: FestivalMatch[]): Action => {
    return {
        type: ActionTypeKeys.ADD_FESTIVAL_MATCHES,
        festivals: festivals
    }
};

export const setMatchingMethod = (method: MatchingMethod): Action => {
    return {
        type: ActionTypeKeys.SET_MATCHING_METHOD,
        method: method
    }
};

export const setChosenArea = (area: Area): Action => {
    return {
        type: ActionTypeKeys.SET_CHOSEN_AREA,
        area: area
    }
};

export const testFestivalMatches = (
    artists: Artist[],
    isTopArtists: Boolean,
    dispatch: Dispatch,
    continents?: string[],
    countries?: string[]
) => {
    dispatch(turnOnLoader());
    const matchRequest: MatchRequest = {
        artists: artists,
        isTopArtists: isTopArtists,
        continents: continents ? continents : [],
        countries: countries ? countries : []
    }
    const backendUrl = 'http://127.0.0.1:8000/onTour/festivalMatches';
    fetch(backendUrl, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchRequest)
    }).then((response: Response) => {
        response.text().then((id: string) => {
            const matching_festivals: FestivalMatch[] = JSON.parse(id);
            dispatch(addFestivalMatches(matching_festivals));
        });
    }).catch((reason) => {
        console.log(reason);
    }).finally(() => dispatch(turnOffLoader()));;
};

export const registerLineup = (
    lineup: Lineup,
    dispatch: Dispatch
) => {
    dispatch(turnOnLoader());
    const backendUrl = 'http://127.0.0.1:8000/onTour/' + lineup.festival + '/register';
    fetch(backendUrl, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(lineup)
    }).catch((reason) => {
        console.log(reason);
    }).finally(() => dispatch(turnOffLoader()));;
};

export const initializeSite = async (
    token: string,
    dispatch: Dispatch
) => {
    if (token) {
        spotifyApi.setAccessToken(token);
    }

    const getAvailableCountries = fetchToJson('http://127.0.0.1:8000/onTour/availableCountries');
    const getAvailableContinents = fetchToJson('http://127.0.0.1:8000/onTour/availableContinents');

    Promise.all([spotifyApi.getMe(), getAvailableCountries, getAvailableContinents])
        .then(async ([responseGetMe, getAvailableCountriesReponse, getAvailableContinentsResponse]) => {
            const getMe: SpotifyApi.CurrentUsersProfileResponse = responseGetMe as SpotifyApi.CurrentUsersProfileResponse;
            const countries: Area[] = getAvailableCountriesReponse as Area[];
            const continents: Area[] = getAvailableContinentsResponse as Area[];

            dispatch(addCountries(countries));
            dispatch(addContinents(continents));

            const userInfo: UserInfo = {
                country: getMe.country,
                displayName: getMe.display_name ? getMe.display_name : undefined,
                profilePictureUrl: getMe.images ? getMe.images[0] ? getMe.images[0].url : undefined : undefined,
                spotifyUrl: getMe.external_urls.spotify,
                id: getMe.id
            }

            dispatch(setUserInfo(userInfo));

            spotifyApi.getMyTopArtists({ limit: 50 })
                .then((response: SpotifyApi.UsersTopArtistsResponse) => {
                    console.log('getTopArtists response: ');
                    console.log(response);
                    const topArtists: Artist[] = response.items.map((artist) => {
                        return {
                            name: artist.name,
                            spotifyId: artist.id,
                            picture: artist.images[0]?.url ? artist.images[0].url : undefined,
                            genres: artist.genres
                        } as Artist;
                    });

                    dispatch(setTopArtists(topArtists));
                    const isRegisteredCountry = countries.find(country => country.isoCode === getMe.country);
                    const userContinent: string = (countries_list as any).countries[getMe.country].continent;
                    const isRegisteredContinent = continents.find(continent => continent.isoCode === userContinent);
                    if (isRegisteredCountry) {
                        dispatch(setChosenArea(isRegisteredCountry));
                    } else if (isRegisteredContinent) {
                        dispatch(setChosenArea(isRegisteredContinent));
                    }
                    testFestivalMatches(
                        topArtists, true, dispatch,
                        isRegisteredCountry ? [] : isRegisteredContinent ? [userContinent] : [],
                        isRegisteredCountry ? [getMe.country] : []
                    );
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(setLoggedOff());
                })

            spotifyApi.getUserPlaylists(getMe.id, { limit: 50 })
                .then((response: SpotifyApi.ListOfUsersPlaylistsResponse) => {

                    const playlists: Playlist[] = response.items.map((playlist) => {
                        if (playlist.tracks.total === 0) {
                            return undefined;
                        } else {
                            return {
                                name: playlist.name,
                                id: playlist.id,
                                images: playlist.images.map((image) => { return image.url; }),
                                ownerId: playlist.owner.id,
                                numTracks: playlist.tracks.total
                            } as Playlist;
                        }
                    }).filter(Boolean) as Playlist[];;

                    dispatch(setPlaylists(playlists));
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(setLoggedOff());
                })
        })
        .catch((error) => {
            if (error instanceof XMLHttpRequest) {
                if (error.status === 401) {
                    dispatch(setLoggedOff());
                }
                console.log('status code: ' + error.status);
            }
            console.log(error);
        })


}
