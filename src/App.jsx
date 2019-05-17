import React, { useState } from 'react';
import { connect } from 'react-redux';

// import uniqueId from 'lodash/fp/uniqueId';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
// import Grid from '@material-ui/core/Grid';
import { TextField } from '@material-ui/core';

// import CircularProgress from '@material-ui/core/CircularProgress';
// import ErrorIcon from '@material-ui/icons/Error';

import { loadRandomRequisition, loadRequisitionById } from './actions';
// import { getSelectedRequisitionId, getSelectedRequisition } from './selectors';

import Form from './Form';

let App = ({
  loadRequisitionById,
  loadRandomRequisition,
  loading,
  error,
  selectedRequisition
}) => {
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
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Material Requisition
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
