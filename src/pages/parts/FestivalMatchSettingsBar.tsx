import React, { useEffect } from 'react';
import { AppState, DispatchProps, MatchingMethod, Playlist, Artist, Area, MatchSettings } from "../../redux/types";
import { spotifyApi, setLoggedOff, testFestivalMatches, turnOnLoader, setMatchSettings, setSelectedPlaylistArtists, getIconPicture, getBigPicture } from "../../redux/actions";
import { connect } from "react-redux";
import { createStyles, Theme, MuiThemeProvider } from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import indigo from "@material-ui/core/colors/indigo";
import { Model } from "../../redux/types";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import { PaletteType } from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListSubheader from '@material-ui/core/ListSubheader';
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import { lightBlue, pink } from "@material-ui/core/colors";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			justifyContent: 'space-between',
			flexGrow: 1,
			flexDirection: 'row',
			padding: theme.spacing(2, 4, 1, 4),
			width: '100%',
			alignItems: 'center',
		},
		alignItems: {
			display: 'flex',
			'@media (max-width: 699px)': {
				width: '100%',
			},
			alignItems: 'center',
		},
		alignItems2: {
			display: 'flex',
			'@media (min-width: 700px)': {
				width: '300px'
			},
			'@media (max-width: 699px)': {
				width: '100%',
			},
			alignItems: 'center',
			justifyContent: 'center',
		},
		box: {
			width: '100%',
			maxWidth: '1000px',
			marginBottom: theme.spacing(2)
		},
		formControl: {
			margin: theme.spacing(1),
			'@media (min-width: 700px)': {
				minWidth: 120,
				maxWidth: 300,
			},
			'@media (max-width: 699px)': {
				width: '100%',
			},
		},
		toolTip: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			paddingBottom: theme.spacing(0.5)
		},
		datePickerFieldFrom: {
			'@media (min-width: 700px)': {
				marginRight: theme.spacing(0.5),
			},
			'@media (max-width: 699px)': {
				marginLeft: theme.spacing(1),
				marginRight: theme.spacing(1),
			},
		},
		datePickerFieldTo: {
			'@media (min-width: 700px)': {
				marginLeft: theme.spacing(0.5),
			},
			'@media (max-width: 699px)': {
				marginRight: theme.spacing(1),
				marginLeft: theme.spacing(1),
			},
		},
		noPadding: {
			paddingRight: 0
		},
		spaceBetween: {
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'row',
			alignItems: 'center',
			'@media (min-width: 700px)': {
				justifyContent: 'space-between',
			},
			'@media (min-width: 1000px)': {
				padding: theme.spacing(0.5, 2, 0, 2),
			},
			'@media (max-width: 999px)': {
				padding: theme.spacing(0.5, 0.5, 0, 0.5),
			},
		},
		marginBottom: {
			marginBottom: '4px',
		},
	}),
);

interface StoreProps {
	model: Model;
	thememode: PaletteType,
	matchingMethod: MatchingMethod,
	playlists: Playlist[],
	topArtists: Artist[],
	selectedPlaylistArtists: Artist[],
	countries: Area[],
	continents: Area[],
	matchSettings: MatchSettings
}

type Props = DispatchProps & StoreProps;

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: '#f5f5f9',
		color: 'rgba(0, 0, 0, 0.87)',
		maxWidth: 320,
		fontSize: theme.typography.pxToRem(12),
		border: '1px solid #dadde9',
	},
}))(Tooltip);

const FestivalMatchSettingsBar: React.FC<Props> = (props: Props) => {

	useEffect(() => {
		if (!props.model.isDbOnline) {
			testMatchesWithGivenSettings(
				matchSettings.area,
				new Date(Date.parse(matchSettings.fromDate)),
				new Date(Date.parse(matchSettings.toDate)),
				matchSettings.matchBasis,
				selectedPlaylistArtists);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// const smallScreen = useMediaQuery('(max-width:610px)');
	const pcScreen = useMediaQuery('(min-width:1200px)');

	const { thememode, playlists, topArtists, selectedPlaylistArtists, countries, continents, dispatch, matchSettings } = props;

	const lightBluePinkMuiTheme = createMuiTheme({
		typography: {
			fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
		},
		palette: {
			primary: {
				light: lightBlue[300],
				main: lightBlue[500],
				dark: lightBlue[700]
			},
			secondary: {
				light: pink[300],
				main: pink[500],
				dark: pink[700]
			},
			type: props.model.thememode
		}
	});

	const testMatchesWithGivenSettings = (
		area: Area,
		dateFrom: Date,
		dateTo: Date,
		chosenPlaylistName: string,
		artistsFromPlaylist: Artist[]
	) => {
		const isTopArtists: boolean = chosenPlaylistName === '__your__top__artists__'
		if (continents.find(continent => continent.isoCode === area.isoCode)) {
			testFestivalMatches(isTopArtists ? topArtists : artistsFromPlaylist, isTopArtists,
				dispatch, dateFrom, dateTo, [area.isoCode], []);
		} else {
			testFestivalMatches(isTopArtists ? topArtists : artistsFromPlaylist, isTopArtists,
				dispatch, dateFrom, dateTo, [], [area.isoCode]);
		}
	}

	const handlePlaylistChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
		if (!event.target.value) {
			return;
		}
		const playlistName = event.target.value as string;
		if (playlistName === matchSettings.matchBasis) {
			return;
		}
		dispatch(setMatchSettings({ ...matchSettings, matchBasis: playlistName }));
		if (playlistName === '__your__top__artists__') {
			testMatchesWithGivenSettings(
				matchSettings.area,
				new Date(Date.parse(matchSettings.fromDate)),
				new Date(Date.parse(matchSettings.toDate)),
				playlistName,
				selectedPlaylistArtists);
			return;
		}

		const playlist = playlists.find(playlist => {
			return playlist.name === playlistName;
		})

		if (playlist) {
			dispatch(turnOnLoader());

			let allArtistIdsRaw: string[] = [];

			for (let offset = 0; offset < playlist.numTracks; offset += 100) {
				const artistIdsRaw: string[] = await spotifyApi.getPlaylistTracks(playlist.ownerId, playlist.id, { offset: offset })
					.then(async (playlistResponse: SpotifyApi.PlaylistTrackResponse) => {

						const artistIdsRaw: string[] = playlistResponse.items.flatMap((trackItem) => {
							return trackItem.track.artists.map((trackArtist) => {
								return trackArtist.id;
							});
						});
						return artistIdsRaw;
					})
					.catch((error) => {
						console.log(error);
						dispatch(setLoggedOff());
						return [];
					});
				allArtistIdsRaw = allArtistIdsRaw.concat(artistIdsRaw);
			}

			const artistIds: string[] = [...new Set(allArtistIdsRaw)].filter(Boolean) as string[];
			let newArtists: Artist[] = [];

			for (let index = 0; index < artistIds.length; index += 50) {
				await spotifyApi.getArtists(artistIds.slice(index, index + 50))
					.then((artistsResponse: SpotifyApi.MultipleArtistsResponse) => {
						artistsResponse.artists.map((artistResponse: SpotifyApi.ArtistObjectFull) => {
							return newArtists.push({
								name: artistResponse.name,
								spotifyId: artistResponse.id,
								hasSpotifyId: true,
								iconPicture: getIconPicture(artistResponse.images),
								bigPicture: getBigPicture(artistResponse.images),
								popularity: artistResponse.popularity,
								genres: artistResponse.genres
							} as Artist);
						})
					}).catch((error) => {
						console.log(error);
						dispatch(setLoggedOff());
						return [];
					});
			}

			if (newArtists.length > 0) {
				testMatchesWithGivenSettings(
					matchSettings.area,
					new Date(Date.parse(matchSettings.fromDate)),
					new Date(Date.parse(matchSettings.toDate)),
					playlistName,
					newArtists);
				dispatch(setSelectedPlaylistArtists(newArtists));
			} else {
				console.log('Something went wrong. No artists in list');
			}
		} else {
			console.log('Could not find playlist: ' + playlistName);
		}
	};

	const handleAreaChange = async (event: React.ChangeEvent<{ value: unknown, name?: string | undefined }>) => {
		if (!event.target.value) {
			return;
		}
		const area: Area = {
			name: event.target.name ? event.target.name : '',
			isoCode: event.target.value as string
		}
		if (area.isoCode !== matchSettings.area.isoCode) {
			testMatchesWithGivenSettings(
				area,
				new Date(Date.parse(matchSettings.fromDate)),
				new Date(Date.parse(matchSettings.toDate)),
				matchSettings.matchBasis,
				selectedPlaylistArtists);
			dispatch(setMatchSettings({ ...matchSettings, area: area }));
		}
	};

	const handleFromDateChange = (date: Date | null) => {
		const toDate = new Date(Date.parse(matchSettings.toDate));
		if (date) {
			if (date > toDate) {
				dispatch(setMatchSettings({ ...matchSettings, fromDate: date.toISOString(), toDate: date.toISOString() }));
				testMatchesWithGivenSettings(matchSettings.area, date, date, matchSettings.matchBasis, selectedPlaylistArtists);
			} else {
				dispatch(setMatchSettings({ ...matchSettings, fromDate: date.toISOString() }));
				testMatchesWithGivenSettings(matchSettings.area, date, toDate, matchSettings.matchBasis, selectedPlaylistArtists);
			}
		}
	};

	const handleToDateChange = (date: Date | null) => {
		const fromDate = new Date(Date.parse(matchSettings.fromDate));
		if (date) {
			if (date < fromDate) {
				dispatch(setMatchSettings({ ...matchSettings, fromDate: date.toISOString(), toDate: date.toISOString() }));
				testMatchesWithGivenSettings(matchSettings.area, date, date, matchSettings.matchBasis, selectedPlaylistArtists);
			} else {
				dispatch(setMatchSettings({ ...matchSettings, toDate: date.toISOString() }));
				testMatchesWithGivenSettings(matchSettings.area, fromDate, date, matchSettings.matchBasis, selectedPlaylistArtists);
			}
		}
	};

	const classes = useStyles();

	if (!props.model.isDbOnline) {
		return (<div />);
	}

	return (
		<Box className={classes.box}>
			<MuiThemeProvider theme={lightBluePinkMuiTheme}>
				<Paper>
					<Box className={classes.spaceBetween}>
						<Box className={classes.alignItems}>
							<FormControl className={classes.formControl} variant="outlined" size="small">
								<InputLabel id="choose-playlist-label">
									Match with
								</InputLabel>
								<Select
									labelId="choose-playlist-label"
									id="choose-playlist"
									value={matchSettings.matchBasis}
									onChange={handlePlaylistChange}
									label="Match with"
								>
									<MenuItem key={'__your__top__artists__'} value={'__your__top__artists__'}>
										Your top artists
									</MenuItem>
									<ListSubheader disableSticky disableGutters>or choose a playlist below</ListSubheader>
									{playlists.map((playlist) => (
										<MenuItem key={playlist.name} value={playlist.name} style={{ maxWidth: 400 }}>
											{playlist.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
						<Box className={classes.alignItems}>
							<FormControl className={classes.formControl} variant="outlined" size="small">
								<InputLabel id="choose-countries-label">Area</InputLabel>
								<Select
									labelId="choose-countries-label"
									id="choose-countries"
									value={matchSettings.area.isoCode}
									onChange={handleAreaChange}
									label="Area"
								>
									{continents.sort((a, b) => a.name > b.name ? 1 : -1).map((continent) =>
										<MenuItem key={continent.isoCode} value={continent.isoCode} style={{ minWidth: 200 }}>
											{continent.name}
										</MenuItem>
									)}
									<ListSubheader disableSticky disableGutters>Countries</ListSubheader>
									{countries.sort((a, b) => a.name > b.name ? 1 : -1).map((country) =>
										<MenuItem key={country.isoCode} value={country.isoCode}>
											{country.name}
										</MenuItem>
									)}
								</Select>
							</FormControl>
						</Box>
						<Box className={classes.alignItems2}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<Grid container justify="space-around" className={classes.marginBottom}>
									<KeyboardDatePicker
										className={classes.datePickerFieldFrom}
										//inputProps={{ classes: { adornedEnd: classes.noPadding } }}
										margin="dense"
										inputVariant="outlined"
										id="date-picker-dialog-from"
										label="From (m/y)"
										format="MM/yyyy"
										maxDate={new Date('2021-12-31')}
										minDate={new Date('2019-01-01')}
										views={['month', 'year']}
										value={matchSettings.fromDate}
										autoOk
										onChange={handleFromDateChange}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
									/>
								</Grid>
								<Grid container justify="space-around" className={classes.marginBottom}>
									<KeyboardDatePicker
										className={classes.datePickerFieldTo}
										margin="dense"
										inputVariant="outlined"
										id="date-picker-dialog-to"
										label="To (m/y)"
										format="MM/yyyy"
										maxDate={new Date('2021-12-31')}
										minDate={new Date('2019-01-01')}
										views={['month', 'year']}
										value={matchSettings.toDate}
										autoOk
										onChange={handleToDateChange}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
									/>
								</Grid>
							</MuiPickersUtilsProvider>
						</Box>
						{pcScreen && <Box className={classes.toolTip}>
							<HtmlTooltip placement="right-start" interactive
								title={
									<React.Fragment>
										<Typography color="inherit" variant="h6">Matching algorithm</Typography>
										{'The matching agorithm is based on the genres of the festivals, giving a higher score if the genres fit well to your top artists or selected playlist. Matching artists in the lineup of a festival will also increase the matching percent.'}
									</React.Fragment>
								}
							>
								<InfoIcon color="primary" style={{ fill: thememode === 'light' ? indigo[500] : '#fcfcfe' }} />
							</HtmlTooltip>
						</Box>
						}
					</Box>
				</Paper>
			</MuiThemeProvider>
		</Box>
	);
};

const mapStateToProps = (state: AppState) => ({
	model: state.model,
	thememode: state.model.thememode,
	matchingMethod: state.model.matchingMethod,
	playlists: state.model.playlists,
	topArtists: state.model.topArtists,
	selectedPlaylistArtists: state.model.selectedPlaylistArtists,
	countries: state.model.countries,
	continents: state.model.continents,
	matchSettings: state.model.matchSettings
});

const mapDispatchToProps = (dispatch: any) => {
	return {
		dispatch
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FestivalMatchSettingsBar);
