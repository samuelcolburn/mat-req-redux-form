import { change } from 'redux-form';
import { CREATE_MANY_NOTES, UPDATE_NOTE } from '../constants';
import { delay } from '../helpers';

export const createManyLineItemNotes = props => ({
  type: CREATE_MANY_NOTES,
  payload: props
});

const readNote = ({ note, user }) => ({
  type: UPDATE_NOTE,
  payload: {
    id: note.id,
    readBy: note.readBy + ';' + user
  }
});

export const saveNote = ({ form, index, note }) => (dispatch, getState) => {
  dispatch(change(form, `lineItems.${index}.addNote`, note, false));
};

export const readNotes = ({ notes, user }) => (dispatch, getState) => {
  delay(200).then(
    success => {
      notes.forEach(note => dispatch(readNote({ note, user })));
    },
    error => {
      console.error(error);
    }
  );
};
