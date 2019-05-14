import React, { useState } from 'react';

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

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const LineItemsHeader = props => {
  const classes = useStyles();

  const [selected, setSelected] = useState(false);

  function handleChange(e) {
    setSelected(e.target.checked);
  }

  return (
    <Grid container alignItems="center">
      <Checkbox
        checked={selected}
        onChange={handleChange}
        value="checkedF"
        color="primary"
      />

      <Typography variant="h6" component="h5" gutterBottom>
        Line Items
      </Typography>

      <Tooltip title="Approve" placement="top">
        <IconButton
          aria-label="Approve"
          size="small"
          className={classes.button}
        >
          <CheckIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Reject" placement="top">
        <IconButton aria-label="Reject" size="small" className={classes.button}>
          <BlockIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Copy" placement="top">
        <IconButton aria-label="Copy" size="small" className={classes.button}>
          <FileCopyIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete" placement="top">
        <IconButton aria-label="Delete" size="small" className={classes.button}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};

export default LineItemsHeader;
