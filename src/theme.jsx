import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'light'
  },
  typography: {
    fontSize: 12
  },
  spacing: 2,
  overrides: {
    MuiInput: {
      input: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
      },
      multiline: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
      }
    },
    MuiButton: {
      label: {
        padding: 0,
        height: 'initial'
      }
    }
  }
});

export default theme;
