import React from "react";
import { Field } from "redux-form";
import Grid from "@material-ui/core/Grid";

import TextField from "../components/TextField";

const LineItem = (lineItem, index, fields) => (
  <Grid container>
    <Grid item xs={12} md={3} lg={3}>
      <Grid container>
        <Grid item xs={12} sm={4} lg={5}>
          <Field
            name={`${lineItem}.status`}
            label="Status"
            component={TextField}
          />
        </Grid>

        <Grid item xs={12} sm={4} lg={5}>
          <Field
            name={`${lineItem}.phase`}
            label="Phase"
            component={TextField}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={3}>
          <Field
            name={`${lineItem}.vendor`}
            label="Vendor"
            component={TextField}
          />
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} md={6} lg={5} xl={6}>
      <Grid container>
        <Grid item xs={12} lg={4}>
          <Field name={`${lineItem}.type`} label="Type" component={TextField} />
        </Grid>

        <Grid item xs={12} lg={8}>
          <Field
            name={`${lineItem}.description`}
            label="Description"
            component={TextField}
            multiline
            fullWidth
          />
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} sm={6} md={2} lg={2}>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.startingInventory`}
            label="Inventory"
            type="number"
            component={TextField}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.quantityRequested`}
            label="Requested"
            type="number"
            component={TextField}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.quantityNeeded`}
            label="Needed"
            type="number"
            component={TextField}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.quantityOrdered`}
            label="Ordered"
            type="number"
            component={TextField}
          />
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} sm={6} md={1} lg={2} xl={1}>
      <Grid container>
        <Grid item xs={6} sm={6} md={12} lg={6}>
          <Field
            name={`${lineItem}.estimatedCost`}
            label="Est Cost"
            type="number"
            component={TextField}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={12} lg={6}>
          <Field
            name={`${lineItem}.currentCost`}
            label="Est Cost"
            type="number"
            component={TextField}
          />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

export default LineItem;
