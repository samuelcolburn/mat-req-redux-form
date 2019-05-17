import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
// import { getFormValues, formValueSelector } from 'redux-form';

// import get from 'lodash/fp/get';
// import uniqueId from 'lodash/fp/uniqueId';
// import compose from 'lodash/fp/compose';
// import getOr from 'lodash/fp/getOr';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';

import { makeStyles } from '@material-ui/styles';

import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';

import { SELECTED_ALL, SELECTED_NONE, SELECTED_SOME } from '../constants';
// import { selectAllSelector } from '../selectors';
import {
  selectAll,
  deselectAll,
  updateStatus,
  copySelected,
  removeSelected
} from '../actions';

let SelectAllCheckBox = ({ checkboxState, selectAll, deselectAll, form }) => {
  function handleChange(e) {
    // If none are selected, select all, otherwise deselect all
    checkboxState === SELECTED_NONE
      ? selectAll({ form })
      : deselectAll({ form });
  }

  return (
    <Checkbox
      checked={checkboxState !== SELECTED_NONE}
      onChange={handleChange}
      value="selected-items"
      color="primary"
      indeterminate={checkboxState === SELECTED_SOME}
    />
  );
};

const selector = (form, ...other) => formValueSelector(form)(...other);

const getSelectAllState = (state, props) => {
  const lineItems = selector(props.form, state, 'lineItems');
  if (!lineItems || !lineItems.length) {
    return { checkboxState: SELECTED_NONE };
  }

  const lineItemsLength = lineItems.length;
  const selectedLength = lineItems.filter(item => item.selected).length;

  const checkboxState = !selectedLength
    ? SELECTED_NONE
    : selectedLength >= 0 && selectedLength < lineItemsLength
    ? SELECTED_SOME
    : selectedLength === lineItems.length
    ? SELECTED_ALL
    : SELECTED_NONE;

  return {
    checkboxState
  };
};

SelectAllCheckBox = connect(
  getSelectAllState,
  {
    selectAll,
    deselectAll
  }
)(SelectAllCheckBox);

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

let HeaderActions = ({
  checkboxState,
  updateStatus,
  copySelected,
  removeSelected,
  form
}) => {
  const classes = useStyles();

  return checkboxState === SELECTED_NONE ? null : (
    <React.Fragment>
      <Tooltip title="Approve" placement="top">
        <IconButton
          aria-label="Approve"
          size="small"
          className={classes.button}
          onClick={e => updateStatus({ status: 'approved', form })}
        >
          <CheckIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Reject" placement="top">
        <IconButton
          aria-label="Reject"
          size="small"
          className={classes.button}
          onClick={e => updateStatus({ status: 'rejected', form })}
        >
          <BlockIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Copy" placement="top">
        <IconButton
          aria-label="Copy"
          size="small"
          className={classes.button}
          onClick={e => copySelected({ form })}
        >
          <FileCopyIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete" placement="top">
        <IconButton
          aria-label="Delete"
          size="small"
          className={classes.button}
          onClick={e => removeSelected({ form })}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};

HeaderActions = connect(
  getSelectAllState,
  // (state, props) => ({
  //   // checkboxState: selectAllSelector(state, props)
  //   checkboxState:
  // }),
  // (state, props) => {
  //   const { form } = props;
  //   if (!form) return { checkboxState: SELECTED_NONE };

  //   const formValues = getFormValues(props.form);
  //   const lineItems = get(['lineItems'], formValues);
  //   const selectedLineItems = state[props.form];
  //   if (!lineItems) return { checkboxState: SELECTED_NONE };
  //   if (!selectedLineItems) return { checkboxState: SELECTED_NONE };
  //   if (!selectedLineItems.length) return { checkboxState: SELECTED_NONE };
  //   const lineItemsLength = lineItems.length;
  //   const selectedLength = selectedLineItems.length;

  //   const checkboxState = !selectedLength
  //     ? SELECTED_NONE
  //     : selectedLength >= 0 && selectedLength < lineItemsLength
  //     ? SELECTED_SOME
  //     : selectedLength === lineItems.length
  //     ? SELECTED_ALL
  //     : SELECTED_NONE;

  //   return { checkboxState };
  // },
  {
    updateStatus,
    copySelected,
    removeSelected
  }
)(HeaderActions);

let LineItemsHeader = ({ form }) => {
  return (
    <Grid container alignItems="center">
      <SelectAllCheckBox form={form} />

      <Typography variant="h6" component="h5">
        Line Items
      </Typography>

      <HeaderActions form={form} />
    </Grid>
  );
};

// const mapStateToProps = (state, props) => ({
//   selectedLineItems: selectedLineItemsSelector(state),
//   lineItems: lineItemsSelector(state)
// });

// const mapStateToProps = (state, props) => ({
//   checkboxState: selectAllSelector(state)
// });

// const mapDispatchToProps = {
//   selectAll,
//   deselectAll
// };

// LineItemsHeader = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(LineItemsHeader);

export default LineItemsHeader;
