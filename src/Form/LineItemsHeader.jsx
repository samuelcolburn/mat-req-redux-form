import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';

import { makeStyles } from '@material-ui/styles';
// import useMediaQueryWithTheme from '../components/useMediaQueryWithTheme';
import Hidden from '@material-ui/core/Hidden';

import { SELECTED_ALL, SELECTED_NONE, SELECTED_SOME } from '../constants';
import {
  selectAll,
  deselectAll,
  updateStatus,
  copySelected,
  removeSelected
} from '../actions';

let SelectAllCheckBox = ({
  checkboxState,
  selectAll,
  deselectAll,
  form,
  classes
}) => {
  function handleChange(e) {
    // If none are selected, select all, otherwise deselect all
    checkboxState === SELECTED_NONE
      ? selectAll({ form })
      : deselectAll({ form });
  }

  return (
    <Checkbox
      className={classes.selectAll}
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

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    paddingLeft: theme.spacing(4)
  },
  selectAll: {
    height: 36,
    width: 30
  },
  button: {
    margin: theme.spacing(1)
  }
}));

HeaderActions = connect(
  getSelectAllState,
  {
    updateStatus,
    copySelected,
    removeSelected
  }
)(HeaderActions);

let LineItemsHeader = ({ form }) => {
  // const mdAndUp = useMediaQueryWithTheme(theme => theme.breakpoints.up('md'));
  const classes = useStyles();
  return (
    <Grid container alignItems="center" className={classes.root}>
      <Hidden smDown>
        <SelectAllCheckBox form={form} classes={classes} />
      </Hidden>

      <Typography variant="h6" component="h5" className={classes.title}>
        Line Items
      </Typography>

      <HeaderActions form={form} classes={classes} />
    </Grid>
  );
};

export default LineItemsHeader;
