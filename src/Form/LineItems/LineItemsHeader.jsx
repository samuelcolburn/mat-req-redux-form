import React from 'react';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';

import { makeStyles } from '@material-ui/styles';

import { SELECTED_NONE } from '../../constants';
import { updateStatus, copySelected, removeSelected } from '../../actions';
import { getSelectAllState } from '../../selectors';

let HeaderActions = ({
  updateStatus,
  copySelected,
  removeSelected,
  form,
  classes
}) => {
  return getSelectAllState === SELECTED_NONE ? null : (
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

const useHeaderStyles = makeStyles(theme => ({
  root: {
    height: 30,
    margin: theme.spacing(4, 8)
  },
  title: {},
  button: {
    margin: theme.spacing(1)
  }
}));

const mapStateToProps = (state, props) => {
  return {
    getSelectAllState: getSelectAllState(state, props)
    // getAllSelected: getAllSelected(state, props)
  };
};

HeaderActions = connect(
  mapStateToProps,
  {
    updateStatus,
    copySelected,
    removeSelected
  }
)(HeaderActions);

let LineItemsHeader = ({ form }) => {
  const classes = useHeaderStyles();
  return (
    <Grid container alignItems="center" className={classes.root}>
      <Typography variant="h6" component="h5" className={classes.title}>
        Line Items
      </Typography>

      <HeaderActions form={form} classes={classes} />
    </Grid>
  );
};

export default LineItemsHeader;
