import React from 'react';
import Grid from '@material-ui/core/Grid';

const LineItemsColumns = () => (
  <Grid container>
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

    <Grid item xs={12} md={6} xl={6}>
      <Grid container>
        <Grid item xs={12} lg={4}>
          Type
        </Grid>
        <Grid item xs={12} lg={8}>
          Item
        </Grid>
      </Grid>
    </Grid>

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
);

export default LineItemsColumns;
