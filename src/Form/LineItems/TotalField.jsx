import React from 'react';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQueryWithTheme from '../../hooks/useMediaQueryWithTheme';
import { makeTotalSelector } from '../../selectors';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  label: {
    flexGrow: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}));

let TotalField = props => {
  const classes = useStyles();

  const mdAndDown = useMediaQueryWithTheme(theme =>
    theme.breakpoints.down('md')
  );

  const { total, label, NumberFieldProps } = props;

  return (
    <div className={classes.root}>
      {mdAndDown && (
        <Typography
          component="span"
          variant="caption"
          color="textSecondary"
          className={classes.label}
        >
          {label}
        </Typography>
      )}
      <NumberFormat
        value={total}
        displayType={'text'}
        thousandSeparator={true}
        decimalScale={2}
        {...NumberFieldProps}
      />
    </div>
  );
};
const mapStateToProps = (state, props) => {
  const getTotal = makeTotalSelector();

  return {
    total: getTotal(state, props)
  };
};

TotalField = connect(mapStateToProps)(TotalField);

export default TotalField;
