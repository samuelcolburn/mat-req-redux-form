import React from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/styles';
// import useMediaQueryWithTheme from '../components/useMediaQueryWithTheme';

import SelectAllCheckbox from './SelectAllCheckbox';

const useStyles = makeStyles(theme => ({
  selectAllSpacer: {
    width: 40
  },
  actions: {
    width: 35,
    minWidth: 35,
    maxWidth: 35
  }
}));

const LineItemsColumns = ({ form }) => {
  const classes = useStyles();

  return (
    <Hidden mdDown>
      <Grid container alignItems="center" wrap="nowrap">
        {/* Select All checkbox */}
        <SelectAllCheckbox form={form} />

        {/* All actual Column headers */}
        <Grid container spacing={2} wrap="nowrap">
          {/* Group1: Status, Phase, Vendors */}
          <Grid item xs={12} md={3} lg={3}>
            <Grid container>
              <Grid item xs={12} lg={5}>
                Status
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={3}>
                Phase
              </Grid>
              <Grid item xs={12} sm={7} md={8} lg={4}>
                Vendor
              </Grid>
            </Grid>
          </Grid>

          {/* Group 2: Type, Item */}
          <Grid item xs={12} md={6} lg={5} xl={6}>
            <Grid container>
              <Grid item xs={12} lg={4}>
                Type
              </Grid>
              <Grid item xs={12} lg={8}>
                Item
              </Grid>
            </Grid>
          </Grid>

          {/* Group 3: Quantities */}
          <Grid item xs={12} sm={6} md={2} lg={2}>
            <Grid container>
              <Grid item xs={6} sm={3} md={6} lg={3}>
                Inventory
              </Grid>
              <Grid item xs={6} sm={3} md={6} lg={3}>
                Requested
              </Grid>
              <Grid item xs={6} sm={3} md={6} lg={3}>
                Needed
              </Grid>
              <Grid item xs={6} sm={3} md={6} lg={3}>
                Ordered
              </Grid>
            </Grid>
          </Grid>

          {/* Group 4: Prices */}
          <Grid item xs={12} sm={6} md={1} lg={2} xl={1}>
            <Grid container>
              <Grid item xs={6} sm={6} md={12} lg={6}>
                Est Cost
              </Grid>
              <Grid item xs={6} sm={6} md={12} lg={6}>
                Curr Cost
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Spacer for the Actions Column */}
        <div className={classes.actions} />
      </Grid>
    </Hidden>
  );
};

export default React.memo(LineItemsColumns);
