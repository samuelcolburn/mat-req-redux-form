import React, { useState } from 'react';
import { connect } from 'react-redux';

// import uniqueId from 'lodash/fp/uniqueId';
import { makeStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
// import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

// import CircularProgress from '@material-ui/core/CircularProgress';
// import ErrorIcon from '@material-ui/icons/Error';

import { loadRandomRequisition, loadRequisitionById } from './actions';
// import { getSelectedRequisitionId, getSelectedRequisition } from './selectors';

import Form from './Form';

import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles(theme => ({
  root: {}
}));

let App = ({
  loadRequisitionById,
  loadRandomRequisition,
  loading,
  error,
  selectedRequisition
}) => {
  const classes = useStyles();

  const [reqId, setReqId] = useState('');

  const loadRequisition = e => {
    console.group('loadRequsition');
    console.log('loadRequisitionById:', loadRequisitionById);
    console.log('loadRandomRequisition: ', loadRandomRequisition);
    console.groupEnd();

    if (reqId && reqId.length) {
      loadRequisitionById({ id: reqId });
    } else {
      loadRandomRequisition();
    }
  };

  // const RequisitionForm = loading ? (
  //   <CircularProgress />
  // ) : error ? (
  //   <Grid container alignItems="center" alignContent="center" justify="center">
  //     <Grid item>
  //       <ErrorIcon color="error" fontSize="large" />
  //     </Grid>

  //     <Grid item>
  //       <Typography variant="h2" component="h2" gutterBottom>
  //         Error Loading Requisition
  //       </Typography>
  //       <Typography variant="h4" component="h4" gutterBottom>
  //         {error}
  //       </Typography>
  //     </Grid>
  //   </Grid>
  // ) : (
  //   <Form rid={formId} form={formId} initialValues={selectedRequisition} />
  // );

  return (
    <Container className={classes.root} maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Material Requisition:
        <Typography variant="h4" component="span" gutterBottom>
          <Hidden smUp>{'XS'}</Hidden>
          <Hidden mdUp>{', SM'}</Hidden>
          <Hidden lgUp>{', MD'}</Hidden>
          <Hidden xlUp>{', LG'}</Hidden>
          <Hidden>{', XL'}</Hidden>
        </Typography>
      </Typography>

      <Button color="primary" variant="contained" onClick={loadRequisition}>
        Load Requisition
      </Button>
      <TextField value={reqId} onChange={e => setReqId(e.target.value)} />

      <Paper>
        <Form />
      </Paper>
    </Container>
  );
};

const mapStateToProps = state => ({
  loading: state.loading,
  error: state.error
});

const mapDispatchToProps = {
  loadRequisitionById,
  loadRandomRequisition
};

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default App;
