import React from 'react';
import { FieldArray } from 'redux-form';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';

import LineItemsColumns from './LineItemsColumns';
import LineItemsHeader from './LineItemsHeader';
import LineItemsList from './LineItemsList';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(8, 0)
  },
  container: {
    display: 'block',
    width: '100%'
  },
  itemContainer: {
    display: 'grid',
    gridTemplateColumns: '30px 5fr 6fr 2fr 2fr 2fr 30px',
    gridColumnGap: '4px',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr 1fr'
    }
  },
  attributeContainer: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(var(--column-width-min), 1fr))',
    alignItems: 'center',
    gridColumnGap: '4px',
    [theme.breakpoints.down('sm')]: {
      gridColumnStart: 1,
      gridColumnEnd: 3
    }
  },
  line: {
    '--column-width-min': '200px',
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr'
    }
  },
  status: {
    '--column-width-min': '125px'
  },
  vendor: {
    '--column-width-min': '150px'
  },
  item: {
    '--column-width-min': '300px',
    gridTemplateColumns: '1fr 3fr',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr'
    }
  },
  // itemType: {
  //   '--column-width-min': '150px'
  // },
  // itemDescription: {
  //   '--column-width-min': '300px'
  // },
  quantityRequest: {
    '--column-width-min': '75px',
    [theme.breakpoints.down('sm')]: {
      gridColumnStart: 1,
      gridColumnEnd: 2
    }
  },
  quantityOrder: {
    '--column-width-min': '75px',
    [theme.breakpoints.down('sm')]: {
      gridColumnStart: 2,
      gridColumnEnd: 3
    }
  },
  cost: {
    '--column-width-min': '80px'
  },
  actions: {
    '--column-width-min': '30px',
    alignItems: 'center'
  },
  lineItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: 'relative',
    '&::before': {
      content: '""',
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.action.hover
    },
    '&:hover::before': {
      opacity: 1
    }
  },
  selectedWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  selectedCheckbox: {
    height: '100%',
    width: '100%',
    padding: 0
  },
  buttonsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr'
  },
  buttonWrapper: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  }
}));

const LineItems = props => {
  const { form, job, shopDrawing } = props;
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <LineItemsHeader form={form} classes={classes} />
      <Grid item xs={12}>
        <div className={classes.container}>
          <Hidden smDown>
            <LineItemsColumns form={form} classes={classes} />
          </Hidden>

          <Divider
            variant="fullWidth"
            style={{ width: '100%' }}
            className={classes.itemContainer}
          />

          <FieldArray
            name="lineItems"
            component={LineItemsList}
            job={job}
            shopDrawing={shopDrawing}
            classes={classes}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default LineItems;
