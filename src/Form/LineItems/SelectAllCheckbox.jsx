import React from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
import Checkbox from '@material-ui/core/Checkbox';

import { SELECTED_NONE, SELECTED_SOME } from '../../constants';
import { selectAll, deselectAll } from '../../actions';
import { getAllSelected } from '../../selectors';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    padding: 0
  }
}));

let SelectAllCheckbox = ({ form, allSelected, selectAll, deselectAll }) => {
  const classes = useStyles();

  function handleChange(e) {
    // If none are selected, select all, otherwise deselect all
    allSelected === SELECTED_NONE ? selectAll({ form }) : deselectAll({ form });
  }

  return (
    <Checkbox
      className={classes.root}
      checked={allSelected !== SELECTED_NONE}
      onChange={handleChange}
      value="selected-items"
      color="primary"
      indeterminate={allSelected === SELECTED_SOME}
    />
  );
};

const mapStateToProps = (state, props) => ({
  allSelected: getAllSelected(state, props)
});

SelectAllCheckbox = connect(
  mapStateToProps,
  {
    selectAll,
    deselectAll
  }
)(SelectAllCheckbox);

export default React.memo(SelectAllCheckbox);
