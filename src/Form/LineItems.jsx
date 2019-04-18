import React from "react";
import uniqueId from "lodash/uniqueId";
import { Field, FieldArray, reduxForm } from "redux-form";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import LineItem from "./LineItem";

import { makeLineItem } from "../helpers";

const LineItemColumns = () => (
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

const LineItems = ({ fields, meta: { error } }) => {
  const addLineItem = () => fields.push(makeLineItem(uniqueId("lineItem_")));

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container>
          <Typography variant="h6" component="h5" gutterBottom>
            Line Items
          </Typography>
        </Grid>

        <LineItemColumns />

        {fields.map(LineItem)}
      </Grid>

      <Grid item xs={12}>
        <Button color="primary" onClick={addLineItem}>
          Add Line Item
        </Button>
      </Grid>
    </Grid>
  );
};

export default LineItems;