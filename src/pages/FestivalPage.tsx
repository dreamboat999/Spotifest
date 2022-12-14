import { useEffect, useState } from 'react';
import {
  Theme,
  Typography,
  Paper,
  Box,
  Button,
  Tabs,
  Tab,
  Switch,
  IconButton,
} from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import ArrowBackOutlined from '@mui/icons-material/ArrowBack';
import PublicIcon from '@mui/icons-material/Public';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ReactCountryFlag from 'react-country-flag';
import ReactPlayer from 'react-player/lazy';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import ArtistBubble from '../components/ArtistBubble';
import { turnOnLoader, turnOffLoader } from '../redux/reducers/displaySlice';
import { FestivalInfo } from '../redux/types';
import '../styles/base.scss';
import { fetchToJson, getApiBaseUrl } from '../utils/restUtils';
import {
  getMaxArtistsInFullLineupWidth,
  displayedLocationName,
} from '../utils/utils';
import { useTheme } from '@mui/material/styles';
import StyledCookieConsent from '../components/CookieConsent';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      '@media (min-width: 440px)': {
        padding: theme.spacing(0, 2, 0, 2),
      },
      '@media (max-width: 439px)': {
        padding: theme.spacing(0, 1, 0, 1),
      },
      alignItems: 'center',
      width: '100%',
    },
    fexColumn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    paper2: {
      display: 'flex',
      flexDirection: 'column',
      '@media (min-width: 1182px)': {
        marginBottom: theme.spacing(2),
      },
      '@media (min-width: 440px)': {
        padding: theme.spacing(0, 2, 0, 2),
      },
      '@media (max-width: 439px)': {
        padding: theme.spacing(0, 1, 0, 1),
      },
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paperVideo: {
      '@media (min-width: 610px)': {
        padding: theme.spacing(2, 4, 2, 4),
      },
      '@media (max-width: 609px)': {
        '@media (min-width: 349px)': {
          padding: theme.spacing(1, 2, 1, 2),
        },
      },
      '@media (max-width: 348px)': {
        padding: theme.spacing(1, 1, 1, 1),
      },
    },
    verticalSpace: {
      display: 'flex',
      '@media (min-width: 610px)': {
        padding: theme.spacing(2, 0, 2, 0),
      },
      '@media (max-width: 609px)': {
        padding: theme.spacing(1, 0, 1, 0),
      },
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    box: {
      width: '100%',
      maxWidth: '750px',
      margin: theme.spacing(0, 2, 2, 2),
    },
    box2: {
      width: '100%',
      maxWidth: '1150px',
      margin: theme.spacing(0, 2, 0, 2),
    },
    videoBox: {
      marginBottom: theme.spacing(2),
    },
    darkerBackground: {
      backgroundColor: '#303030',
    },
    lineupView: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    artistAvatarBox: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '99%',
    },
    lineupPosterBox: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(2),
    },
    lineupPoster: {
      maxHeight: 450,
      '@media (min-width: 610px)': {
        maxWidth: 450,
      },
      '@media (max-width: 609px)': {
        maxWidth: 300,
      },
    },
    tabLabel: {
      fontSize: '20px',
    },
    sortButtonBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      textTransform: 'none',
      padding: theme.spacing(0),
      fontSize: '18px',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    invisibleButton: {
      display: 'none',
    },
    align: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabPanel: {
      '@media (min-width: 690px)': {
        padding: theme.spacing(2, 0, 2, 0),
      },
      '@media (max-width: 689px)': {
        padding: theme.spacing(1, 0, 1, 0),
      },
    },
    tabRoot: {
      '@media (min-width: 900px)': {
        minWidth: '160px',
      },
      '@media (min-width: 610px)': {
        '@media (max-width: 899px)': {
          minWidth: '100px',
        },
      },
      '@media (max-width: 609px)': {
        minWidth: '72px',
      },
    },
    topLeft: {
      position: 'absolute',
      top: theme.spacing(8),
      left: theme.spacing(2),
    },
    festivalTitleBox: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    artistWidth: {
      '@media (min-width: 690px)': {
        width: '100px',
      },
      '@media (max-width: 689px)': {
        width: '75px',
      },
    },
  })
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const FestivalPage = () => {
  const boxForLineups = useMediaQuery('(min-width:1182px)');
  const mediumScreen = useMediaQuery('(min-width:610px)');
  const smallScreen = useMediaQuery('(max-width:440px)');
  const bigScreen = useMediaQuery('(min-width:690px)');
  const pcScreen = useMediaQuery('(min-width:1300px)');
  const videoSizeMax = useMediaQuery('(min-width:770px)');
  const videoSizeSmall = useMediaQuery('(max-width:470px)');

  const { festivalId } = useParams();

  const themeDirection = useTheme().direction;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const limitLineups = !mediumScreen ? 4 : undefined;

  const maxArtistsInLineupsWidth = getMaxArtistsInFullLineupWidth(
    bigScreen,
    smallScreen,
    11
  );

  useEffect(() => {
    dispatch(turnOnLoader());
    fetchToJson(getApiBaseUrl() + '/onTour/festivalInfo/?q=' + festivalId)
      .then((response: any) => {
        setFestivalInfo(response as FestivalInfo);
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof TypeError) {
          setIsNetworkError(true);
        } else {
          setIsFestivalInDb(false);
        }
      })
      .finally(() => dispatch(turnOffLoader()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [festivalInfo, setFestivalInfo] = useState<FestivalInfo | undefined>(
    undefined
  );
  const [isFestivalInDb, setIsFestivalInDb] = useState(true);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [selectedLineup, setSelectedLineup] = useState(0);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);

  const classes = useStyles();

  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box className={classes.tabPanel}>{children}</Box>}
      </Typography>
    );
  };

  if (!festivalInfo) {
    return (
      <div className={classes.align}>
        <div className={classes.verticalSpace} />
        <div className={classes.verticalSpace} />
        {isNetworkError && (
          <Typography variant="subtitle1">
            There seems to be some issue with connecting to our database. Try
            refreshing the page.
          </Typography>
        )}
        {!isNetworkError && !isFestivalInDb && (
          <Typography variant="subtitle1">Could not find festival.</Typography>
        )}
        {!isNetworkError && !festivalId && (
          <Typography variant="subtitle1">Invalid URL.</Typography>
        )}
      </div>
    );
  } else {
    return (
      <>
        {pcScreen && (
          <div className={classes.topLeft}>
            <IconButton
              onClick={() => {
                window.history.back();
                setTimeout(() => navigate('/'), 10);
              }}
            >
              <ArrowBackOutlined fontSize="large" />
            </IconButton>
          </div>
        )}
        <div className={classes.verticalSpace} />
        <div className={classes.fexColumn}>
          <div className={classes.root}>
            <Box className={classes.box}>
              <Paper
                elevation={3}
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 1,
                  '@media (min-width: 690px)': { px: 4 },
                  '@media (max-width: 689px)': {
                    '@media (min-width: 440px)': { px: 2 },
                  },
                  '@media (max-width: 439px)': { px: 2 },
                }}
                key={'festivalInfo:' + festivalInfo.name}
              >
                <div className={classes.festivalTitleBox}>
                  <Typography
                    variant={bigScreen ? 'h3' : 'h4'}
                    sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
                  >
                    {festivalInfo.name}
                  </Typography>
                </div>
                <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                  {displayedLocationName(festivalInfo.locationText)}{' '}
                  <ReactCountryFlag
                    countryCode={festivalInfo.country}
                    svg
                    style={{ marginLeft: '8px' }}
                  />
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ m: 1, textAlign: 'center' }}
                >
                  {'Genres: ' + festivalInfo.genres.slice(0, 5).join(', ')}
                </Typography>
                <div>
                  {festivalInfo.webpage && (
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ p: 1, minWidth: 0, mx: 2, my: 1, borderRadius: 2 }}
                      onClick={() =>
                        window.open(festivalInfo.webpage, '_blank')
                      }
                    >
                      <PublicIcon />
                    </Button>
                  )}
                  {festivalInfo.ticketWebpage && (
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ p: 1, minWidth: 0, mx: 2, my: 1, borderRadius: 2 }}
                      onClick={() =>
                        window.open(festivalInfo.ticketWebpage, '_blank')
                      }
                    >
                      <LocalActivityIcon />
                    </Button>
                  )}
                </div>
              </Paper>
            </Box>
            {festivalInfo.video && (
              <Box className={classes.videoBox}>
                <Paper
                  elevation={3}
                  className={classes.paperVideo}
                  key={'festival video:' + festivalInfo.name}
                >
                  <ReactPlayer
                    url={festivalInfo.video}
                    controls
                    data-cookiescript="accepted"
                    data-cookiecategory="functionality"
                    width={
                      videoSizeMax
                        ? undefined
                        : mediumScreen
                        ? 496
                        : videoSizeSmall
                        ? '100%'
                        : 400
                    }
                    height={
                      videoSizeMax
                        ? undefined
                        : mediumScreen
                        ? 279
                        : videoSizeSmall
                        ? '100%'
                        : 225
                    }
                  />
                </Paper>
              </Box>
            )}
          </div>
          {festivalInfo.lineups.length !== 0 && (
            <Box className={classes.box2}>
              <Paper
                square={!boxForLineups}
                elevation={3}
                className={classes.paper2}
                key={'festival lineups:' + festivalInfo.name}
              >
                <Tabs
                  centered
                  value={selectedLineup}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={(event: React.ChangeEvent<{}>, newValue: number) =>
                    setSelectedLineup(newValue)
                  }
                  aria-label="lineups"
                >
                  {festivalInfo.lineups
                    .slice(0, limitLineups)
                    .map((lineup, idx) => (
                      <Tab
                        label={
                          <span className={classes.tabLabel}>
                            {lineup.year}
                          </span>
                        }
                        value={idx}
                        key={'tab: ' + festivalInfo.name + lineup.year}
                        classes={{ root: classes.tabRoot }}
                      />
                    ))}
                </Tabs>
                <SwipeableViews
                  axis={themeDirection === 'rtl' ? 'x-reverse' : 'x'}
                  index={selectedLineup}
                  onChangeIndex={(newValue: number) =>
                    setSelectedLineup(newValue)
                  }
                >
                  {festivalInfo.lineups
                    .slice(0, limitLineups)
                    .map((lineup, idx) => (
                      <TabPanel
                        value={selectedLineup}
                        index={idx}
                        key={'tabPanel: ' + festivalInfo.name + lineup.year}
                      >
                        {lineup.artists.length === 0 ? (
                          <Box className={classes.lineupView}>
                            <Typography variant="h6">
                              No lineup registered
                            </Typography>
                          </Box>
                        ) : (
                          <Box className={classes.lineupView}>
                            {lineup.cancelled ? (
                              <Typography variant="h6" color="secondary">
                                {'CANCELLED' +
                                  (lineup.date_str
                                    ? ' (' + lineup.date_str + ')'
                                    : '')}
                              </Typography>
                            ) : (
                              <Typography variant="h5">
                                {lineup.date_str}
                              </Typography>
                            )}
                            <Box className={classes.sortButtonBox}>
                              {/* The invisible button is a quick fix for click event propagation from the grid item */}
                              <Button
                                hidden
                                className={classes.invisibleButton}
                              >
                                .
                              </Button>
                              <Button
                                disableRipple
                                disableElevation
                                className={classes.button}
                                color={
                                  !sortAlphabetically ? 'primary' : 'inherit'
                                }
                                onClick={() => setSortAlphabetically(false)}
                              >
                                Popularity
                              </Button>
                              <Switch
                                checked={sortAlphabetically}
                                color="default"
                                onChange={(evt: any) =>
                                  setSortAlphabetically(
                                    evt.target.checked ? true : false
                                  )
                                }
                                name="switchSortAlphabetically"
                              />
                              <Button
                                disableRipple
                                disableElevation
                                className={classes.button}
                                color={
                                  sortAlphabetically ? 'primary' : 'inherit'
                                }
                                onClick={() => setSortAlphabetically(true)}
                              >
                                Alphabetically
                              </Button>
                            </Box>
                            <div className={classes.artistAvatarBox}>
                              {lineup.artists.length > 0 &&
                                lineup.artists
                                  .sort((a, b) =>
                                    (
                                      sortAlphabetically
                                        ? a.name > b.name
                                        : a.popularity < b.popularity
                                    )
                                      ? 1
                                      : -1
                                  )
                                  .map((artist) => (
                                    <ArtistBubble
                                      artist={artist}
                                      key={
                                        'avatar_festival_lineup_artist_' +
                                        festivalInfo.name +
                                        lineup.year +
                                        artist.name
                                      }
                                      bubbleId={
                                        'avatar_festival_lineup_artist_' +
                                        festivalInfo.name +
                                        lineup.year +
                                        artist.name
                                      }
                                    />
                                  ))}
                              {lineup.artists.length > 0 &&
                                Array.from(
                                  {
                                    length:
                                      maxArtistsInLineupsWidth -
                                      (lineup.artists.length %
                                        maxArtistsInLineupsWidth),
                                  },
                                  (_, i) => (
                                    <div
                                      className={classes.artistWidth}
                                      key={i}
                                    />
                                  )
                                )}
                            </div>
                            {lineup.poster && (
                              <div className={classes.lineupPosterBox}>
                                <Button
                                  onClick={() =>
                                    window.open(lineup.poster, '_blank')
                                  }
                                >
                                  <img
                                    className={classes.lineupPoster}
                                    src={lineup.poster}
                                    alt=""
                                  />
                                </Button>
                              </div>
                            )}
                          </Box>
                        )}
                      </TabPanel>
                    ))}
                </SwipeableViews>
              </Paper>
            </Box>
          )}
        </div>
        {festivalInfo.video && (
          <StyledCookieConsent>
            The youtube videos on this site use cookies.
          </StyledCookieConsent>
        )}
      </>
    );
  }
};

export default FestivalPage;
