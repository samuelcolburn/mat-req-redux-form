import React from "react";
import { connect } from "react-redux";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';

import { loadRandomRequisition } from "./actions";
import Form from "./Form";

let App = ({ rid, load, loading, error }) => {

  const form = loading
  ? (
    <CircularProgress />
  ) : error
  ? (
    <Grid container alignItems="center" alignContent="center" justify="center">
      <Grid item >
      < ErrorIcon color="error" fontSize="large" />
      </Grid>

      <Grid item>
        <Typography variant="h2" component="h2" gutterBottom>
        Error Loading Requisition
        </Typography>
        <Typography variant="h4" component="h4" gutterBottom>
        {error}
        </Typography>
      </Grid>
    </Grid>
    ) : (
      <Form rid={rid} />
    )

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Create React App v4-alpha example
      </Typography>

      <Button
        color="primary"
        variant="contained"
        onClick={() => load()}
      >
        Load Requisition
      </Button>

      <Paper>
        {form}
      </Paper>
    </Container>
  );
};

const mapStateToProps = state => ({
  rid: state.selectedRequisitionId,
  loading: state.loading,
  error: state.error
});

const mapDispatchToProps = {
  load: loadRandomRequisition
};

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default App;
