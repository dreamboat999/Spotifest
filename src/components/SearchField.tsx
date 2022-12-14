import {
  IconButton,
  Typography,
  InputAdornment,
  TextField,
  Paper,
  Box,
  CircularProgress,
  ClickAwayListener,
  ThemeProvider,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import SearchIcon from '@mui/icons-material/Search';
import StandardLink from './StandardLink';
import { getArtistUrl, getFestivalUrl } from '../utils/utils';
import { useSearchDb } from './SearchField.utils';
import { createTheme } from '@mui/material/styles';
import { getMainTheme } from '../theme/theme.styles';
import MatchHighlighter, { escapeRegExp } from './MatchHighlighter';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fixed: {
      position: 'absolute',
      '@media (min-width: 610px)': {
        width: '250px',
      },
      '@media (max-width: 609px)': {
        width: '200px',
      },
      padding: theme.spacing(1, 1, 1, 1),
    },
    fixedAndAligned: {
      position: 'fixed',
      '@media (min-width: 610px)': {
        width: '250px',
      },
      '@media (max-width: 609px)': {
        width: '200px',
      },
      display: 'flex',
      padding: theme.spacing(1, 1, 1, 1),
      alignItems: 'center',
      justifyContent: 'center',
    },
    fixedWidthAbsolute: {
      '@media (min-width: 610px)': {
        width: '250px',
      },
      '@media (max-width: 609px)': {
        position: 'absolute',
        minHeight: '40px',
        width: '200px',
      },
      '@media (min-width: 590px)': {
        '@media (max-width: 609px)': {
          marginRight: '44px',
        },
      },
      '@media (min-width: 440px)': {
        '@media (max-width: 589px)': {
          marginRight: '36px',
        },
      },
      '@media (max-width: 439px)': {
        marginRight: '28px',
      },
    },
  })
);

interface Props {
  setShowSearchFieldSmallScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchField = ({ setShowSearchFieldSmallScreen }: Props) => {
  const bigScreen = useMediaQuery('(min-width:610px)');

  const classes = useStyles();
  const { inputText, setInputText, searchResults } = useSearchDb();

  const darkTheme = createTheme(getMainTheme('dark'));
  const lightTheme = createTheme(getMainTheme('light'));

  return (
    <ThemeProvider theme={darkTheme}>
      <ClickAwayListener
        onClickAway={() => {
          setInputText('');
          setShowSearchFieldSmallScreen(false);
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {!bigScreen && (
            <Box sx={{ minHeight: ({ spacing }) => spacing(5) }} />
          )}
          <TextField
            size="small"
            autoFocus={bigScreen ? false : true}
            className={classes.fixedWidthAbsolute}
            placeholder="Search"
            value={inputText}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setInputText(event.target.value)
            }
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={
              bigScreen
                ? {
                    endAdornment: (
                      <InputAdornment position="end" disablePointerEvents>
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                : {}
            }
          />
          <ThemeProvider theme={lightTheme}>
            <div>
              {searchResults.loading && inputText && (
                <Paper elevation={10} className={classes.fixedAndAligned}>
                  <CircularProgress />
                </Paper>
              )}
              {searchResults.error && (
                <div>Error: {searchResults.error.message}</div>
              )}
              {searchResults.result && inputText && (
                <Paper elevation={10} className={classes.fixed}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {searchResults.result.festivals.length === 0 &&
                      searchResults.result.artists.length === 0 && (
                        <Typography color="primary" component="div">
                          No results
                        </Typography>
                      )}
                    {searchResults.result.festivals.length > 0 && (
                      <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
                        Festivals:
                      </Typography>
                    )}
                    {searchResults.result.festivals
                      .slice(0, 5)
                      .map((festival: any) => (
                        <StandardLink
                          color={'textSecondary'}
                          key={'searchResult festival: ' + festival.name}
                          href={getFestivalUrl(festival.name)}
                          onClick={() => setInputText('')}
                          sx={{ mb: 1 }}
                          variant="body2"
                        >
                          <MatchHighlighter
                            text={festival.name}
                            regex={
                              new RegExp(`(${escapeRegExp(inputText)})`, 'ig')
                            }
                          />
                          {': ' + festival.location}
                        </StandardLink>
                      ))}
                    {searchResults.result.festivals.length > 5 && (
                      <Typography
                        color="textSecondary"
                        variant="subtitle1"
                        sx={{ mt: -1 }}
                      >
                        ...
                      </Typography>
                    )}
                    {searchResults.result.festivals.length > 0 &&
                      searchResults.result.artists.length > 0 && (
                        <Box sx={{ mt: 2 }} />
                      )}
                    {searchResults.result.artists.length > 0 && (
                      <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
                        Artists:
                      </Typography>
                    )}
                    {searchResults.result.artists
                      .slice(0, 5)
                      .map((artist: any) => (
                        <StandardLink
                          color={'textSecondary'}
                          key={'searchResult artist: ' + artist.name}
                          href={getArtistUrl(artist.name, artist.spotifyId)}
                          onClick={() => setInputText('')}
                          sx={{ mb: 1 }}
                          variant="body2"
                        >
                          <MatchHighlighter
                            text={artist.name}
                            regex={
                              new RegExp(`(${escapeRegExp(inputText)})`, 'ig')
                            }
                          />
                        </StandardLink>
                      ))}
                    {searchResults.result.artists.length > 5 && (
                      <Typography
                        color="textSecondary"
                        variant="subtitle1"
                        sx={{ mt: -1 }}
                      >
                        ...
                      </Typography>
                    )}
                  </Box>
                </Paper>
              )}
            </div>
          </ThemeProvider>
        </Box>
      </ClickAwayListener>
    </ThemeProvider>
  );
};

export default SearchField;
