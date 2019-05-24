import { useTheme } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Helper function that just makes it so we don't have to import
// useTheme and useMediaQuery in every component, since we will
// almost always want to use theme breakpoints when using useMediaQuery.
const useMediaQueryWithTheme = (themeQuery, options) => {
  const theme = useTheme();

  return useMediaQuery(themeQuery(theme), { noSsr: true, ...options });
};

export default useMediaQueryWithTheme;
