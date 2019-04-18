import { createSelector } from "reselect";
import { createSelector as ormCreateSelector } from "redux-orm";
import orm from "./orm";

const dbStateSelector = state => state.db;

export const jobs = ormCreateSelector(orm, dbStateSelector, session => {
  return session.Job.all()
    .toModelArray()
    .map(job => {
      const obj = job.ref;

      return Object.assign({}, obj, {
        shopDrawings: job.shopDrawings
          .toRefArray()
          .map(shopDrawing => shopDrawing.subject),
        phases: job.phases.toRefArray().map(phase => phase.phase)
      });
    });
});

export const requisitionSelector = createSelector(
  dbStateSelector,
  (state, props) => props,
  ormCreateSelector(orm, (session, props) => {
    console.log("requisitionSelector");
    console.log("props: ", props);
    const model = session.Requisition.withId(props.rid);

    const obj = model ? model.ref : {};

    return {
      ...obj,
      lineItems: model ? model.requisitionLineItems.toRefArray() : []
    };
  })
);
