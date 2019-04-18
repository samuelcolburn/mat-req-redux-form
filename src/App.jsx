import React, { useEffect } from "react";
import { connect } from "react-redux";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { loadRequisitionById } from "./actions";
import Form from "./Form";

let App = ({ rid, load }) => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Create React App v4-alpha example
      </Typography>

      <Button
        color="primary"
        variant="contained"
        onClick={() => load({ id: "1" })}
      >
        Load Requisition
      </Button>

      <Form rid={rid} />
    </Container>
  );
};

const mapStateToProps = state => ({
  rid: state.selectedRequisitionId
});

const mapDispatchToProps = {
  load: loadRequisitionById
};

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default App;
