import validationSchema from './validationSchema';

export const asyncValidate = values => {
  return validationSchema.validate(values, { abortEarly: false }).catch(err =>
    err.inner.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.path]: curr.message
      }),
      {}
    )
  );
};

export const validate = values => {
  // console.log("validating: ", values);
  // console.log("validationSChema: ", validationSchema);
  try {
    validationSchema.validateSync(values, { abortEarly: false });
    return {};
  } catch (err) {
    return err.inner.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.path]: curr.message
      }),
      {}
    );
  }
};

export default asyncValidate;
