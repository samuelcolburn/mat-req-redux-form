import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import DebouncedTextField from '../components/DebouncedTextField';
import TextField from '../components/TextField';
import Autocomplete from '../components/Autocomplete';
import DebouncedDatePickerField from '../components/DebouncedDatePickerField';

import LineItems from './LineItems';
import Attachments from './Attachments';

import { validate } from '../validate';

import { getSelectedRequisitionId, getSelectedRequisition } from '../selectors';

import { onChange } from '../actions';

const jobToString = job => (job ? `${job.number} - ${job.name}` : '');

const shopDrawingToString = shopDrawing =>
  shopDrawing ? `SD.${shopDrawing.number} - ${shopDrawing.subject}` : '';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(8, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 2)
    },
    [theme.breakpoints.only('xs')]: {
      padding: 0
    }
  },
  title: {
    paddingLeft: theme.spacing(4)
  },
  header: {},
  lineItems: {
    marginTop: theme.spacing(8)
    // display: 'grid',
    // gridTemplateColumns: `
    // [select-checkbox] 25px
    // [status] 125px
    // [phase] 75px
    // [vendor] 200px
    // [type] 170px
    // [item] minmax(335px, auto)
    // [qty-inventory] 75px
    // [qty-requested] 75px
    // [qty-needed] 75px
    // [qty-ordered] 75px
    // [cost-est] 80px
    // [cost-current] 80px
    // [actions] 30px
    // `,
    // gridTemplateRows: '30px'
  }
}));
//       <Grid container className={classes.header} component="section">

let Form = props => {
  const {
    rid,
    form,
    handleSubmit,
    pristine,
    reset,
    submitting,
    job,
    shopDrawing
  } = props;

  const classes = useStyles();

  function onSubmit(e) {
    e.persist();
    e.preventDefault();

    console.log('onSubmit:');
    console.log('data: ');
  }

  return (
    <form onSubmit={e => onSubmit(e)} className={classes.root}>
      <Typography
        variant="h6"
        component="h5"
        gutterBottom
        className={classes.title}
      >
        <span>Rid: </span>
        <span>{rid}</span>
      </Typography>

      <Grid container className={classes.header} spacing={4}>
        <Grid item xs={6} md={4}>
          <Field
            name="createdBy"
            label="Created By"
            component={TextField}
            readOnly
            disabled
            margin="dense"
            fullWidth
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <Field
            name="dateCreated"
            label="Date Created"
            placeholder="Date Created"
            dateFormat="MM/dd/yyyy"
            component={DebouncedDatePickerField}
            margin="dense"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Field
            name="dateNeeded"
            label="Date Needed"
            placeholder="Date Needed"
            dateFormat="MM/dd/yyyy"
            component={DebouncedDatePickerField}
            margin="dense"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4}>
          <Field
            name="job"
            label="Job"
            placeholder="Search for a Job..."
            table="jobs"
            itemToString={jobToString}
            component={Autocomplete}
            margin="dense"
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={8}>
          <Field
            name="shopDrawing"
            label="Shop Drawing"
            placeholder={
              job && job.id ? 'Search for a Shop Drawing...' : 'Choose a Job'
            }
            disabled={!(job && job.id)}
            table="shopDrawings"
            params={{
              related: [
                {
                  key: 'relatedJob',
                  value: job && job.id ? job.id : 0
                }
              ]
            }}
            itemToString={shopDrawingToString}
            component={Autocomplete}
            margin="dense"
          />
        </Grid>

        <Grid item xs={2} md={1}>
          <Field
            name="number"
            label="TO #"
            component={DebouncedTextField}
            margin="dense"
            fullWidth
          />
        </Grid>

        <Grid item xs={10} md={11}>
          <Field
            name="subject"
            label="Subject"
            component={DebouncedTextField}
            margin="dense"
            fullWidth
          />
        </Grid>
      </Grid>

      {/* <Grid container className={classes.lineItems} component="section">
        <LineItemsHeader form={form} />

        <LineItemsColumns form={form} />

        <Divider variant="fullWidth" style={{ width: '100%' }} />

        <FieldArray
          name="lineItems"
          component={LineItems}
          job={job}
          shopDrawing={shopDrawing}
        />
      </Grid> */}
      <LineItems job={job} shopDrawing={shopDrawing} form={form} />

      {/* Attachments */}
      <Attachments />

      <section className="actions">
        <Button
          variant="contained"
          color="primary"
          type="button"
          disabled={submitting}
          onClick={reset}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={submitting}
        >
          Save
        </Button>
      </section>
    </form>
  );
};

// Form = reduxForm({
//   validate,
//   // enableReinitialize: true,
//   // immutableProps: [
//   //   'rid',
//   //   'number',
//   //   'subject',
//   //   'createdBy',
//   //   'dateCreated',
//   //   'dateNeeded'
//   // ],
//   // asyncBlurFields: ["createdBy", "dateCreated"]
//   onChange
// })(Form);

// const selector = (form, ...other) => formValueSelector(form)(...other);
const selector = formValueSelector('RequisitionForm');

const mapStateToProps = (state, props) => {
  return {
    rid: getSelectedRequisitionId(state),
    initialValues: getSelectedRequisition(state),
    job: selector(state, 'job'),
    shopDrawing: selector(state, 'shopDrawing')
  };
};

// Form = connect(mapStateToProps)(Form);

export default compose(
  connect(mapStateToProps),
  reduxForm({
    // validate,
    onChange,
    form: 'RequisitionForm',
    enableReinitialize: true
  })
)(Form);
