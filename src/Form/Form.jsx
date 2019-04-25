import React from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import TextField from '../components/TextField';
import Autocomplete from '../components/Autocomplete';
import LineItems from './LineItems';

import { validate } from '../validate';

import { requisitionSelector } from '../selectors';

import { onChange } from '../actions';

const jobToString = job => (job ? `${job.number} - ${job.name}` : '');

const shopDrawingToString = shopDrawing =>
  shopDrawing ? `SD.${shopDrawing.number} - ${shopDrawing.subject}` : '';

let Form = props => {
  const {
    handleSubmit,
    pristine,
    reset,
    submitting,
    rid,
    job,
    shopDrawing
  } = props;

  function onSubmit(e) {
    e.persist();
    e.preventDefault();

    console.log('onSubmit:');
    console.log('data: ');
  }

  return (
    <form onSubmit={e => onSubmit(e)}>
      <Typography variant="h6" component="h5" gutterBottom>
        <span>Rid: </span>
        <span>{rid}</span>
      </Typography>
      <section className="header">
        <Field
          name="createdBy"
          label="Created By"
          component={TextField}
          readOnly
          disabled
        />

        <Field
          name="dateCreated"
          label="Date Created"
          component={TextField}
          readOnly
          disabled
        />

        <Field name="dateNeeded" label="Date Needed" component={TextField} />

        <Field
          name="job"
          label="Job"
          placeholder="Search for a Job..."
          table="jobs"
          itemToString={jobToString}
          component={Autocomplete}
        />
        <Field
          name="shopDrawing"
          label="Shop Drawing"
          placeholder="Search for a Shop Drawing..."
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
        />
        <Field name="number" label="TO #" component={TextField} />
        <Field name="subject" label="Subject" component={TextField} fullWidth />
      </section>

      <FieldArray
        name="lineItems"
        component={LineItems}
        job={job}
        shopDrawing={shopDrawing}
      />

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
const FORM_NAME = 'RequisitionForm';

const selector = formValueSelector(FORM_NAME);

Form = reduxForm({
  form: FORM_NAME, // a unique identifier for this form
  validate,
  enableReinitialize: true,
  immutableProps: ['rid', 'number', 'subject'],
  onChange
  // asyncBlurFields: ["createdBy", "dateCreated"]
})(Form);

const mapStateToProps = (state, props) => ({
  initialValues: requisitionSelector(state, props),
  job: selector(state, 'job'),
  shopDrawing: selector(state, 'shopDrawing')
});

Form = connect(mapStateToProps)(Form);

export default Form;
