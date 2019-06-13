import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import { connect } from 'react-redux';

import { Field } from 'redux-form';
import { makeStyles } from '@material-ui/styles';

import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ChatIcon from '@material-ui/icons/Chat';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';

import { MuiPickersContext } from '@material-ui/pickers';

import {
  usePopupState,
  bindTrigger,
  bindPopover
} from 'material-ui-popup-state/hooks';

import useMediaQueryWithTheme from '../../hooks/useMediaQueryWithTheme';
import DebouncedTextField from '../../components/DebouncedTextField';

import { saveNote, readNotes } from '../../actions';
import { noteSelector } from '../../selectors';

const useDialogStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(4),
    maxWidth: 300
  },
  listItem: {
    padding: 0
  },
  input: {
    margin: theme.spacing(4, 0)
  }
}));

const userHasNotReadNote = user => note =>
  !(
    note.relatedUser === user.id ||
    (note &&
      note.readBy &&
      note.readBy.split(';').some(reader => reader === user.id))
  );

const getUnreadNotes = user => notes => notes.filter(userHasNotReadNote(user));

const DialogNotesContent = React.memo(
  ({ focusedInput, notes, value, setValue, handleSave, handleCancel }) => {
    const classes = useDialogStyles();
    const utils = useContext(MuiPickersContext);

    return (
      <Paper className={classes.paper}>
        <List dense disablePadding>
          {notes.map((note, index) => {
            const dateCreated = utils.format(note.dateCreated, 'MM/dd/yyyy');
            const userName = `${note.user.firstName} ${note.user.lastName}`;
            return (
              <ListItem
                dense
                key={index}
                className={classes.listItem}
                disableGutters
              >
                <ListItemText
                  primary={note.note}
                  secondary={`${dateCreated} - ${userName}`}
                />
              </ListItem>
            );
          })}
        </List>

        <TextField
          className={classes.input}
          inputRef={focusedInput}
          value={value}
          onChange={e => setValue(e.target.value)}
          label="Add Note"
          fullWidth
          multiline
          variant="outlined"
        />
        <Grid container justify="flex-end">
          <Button color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
      </Paper>
    );
  }
);

const DialogNotes = ({
  index,
  id,
  form,
  saveNote,
  notes,
  unreadNotes,
  onOpen
}) => {
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `line_item_notes_${id}`
  });

  const [value, setValue] = useState('');

  const focusedInput = React.useCallback(node => {
    if (node !== null) {
      node.focus();
    }
  }, []);

  function handleClick(event) {
    popupState.open(event);
    onOpen(event);
  }

  function handleSave(event) {
    popupState.close(event);
    saveNote({ form, index, note: value });
  }

  function handleCancel(event) {
    popupState.close(event);
  }

  return (
    <React.Fragment>
      <IconButton
        {...bindTrigger(popupState)}
        onClick={handleClick}
        size="small"
      >
        <Badge badgeContent={unreadNotes.length} color="primary">
          <ChatIcon />
        </Badge>
      </IconButton>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <DialogNotesContent
          handleSave={handleSave}
          handleCancel={handleCancel}
          focusedInput={focusedInput}
          notes={notes}
          value={value}
          setValue={setValue}
        />
      </Popover>
    </React.Fragment>
  );
};

const useExpansionStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(4)
  }
}));

const ExpansionNotes = ({
  lineItem,
  index,
  id,
  form,
  user,
  saveNote,
  notes,
  unreadNotes,
  onOpen
}) => {
  const classes = useExpansionStyles();
  const utils = useContext(MuiPickersContext);
  const [showNotes, setShowNotes] = useState(false);

  function handleClick(e) {
    setShowNotes(prev => !prev);
    onOpen(e);
  }

  useEffect(() => {
    if (showNotes) onOpen();
  }, [showNotes, onOpen]);

  return (
    <Grid container alignItems="flex-start">
      <IconButton
        onClick={handleClick}
        size="small"
        disabled={!notes || !notes.length}
        className={classes.button}
      >
        <Badge badgeContent={unreadNotes.length} color="primary">
          <ChatIcon />
        </Badge>
      </IconButton>

      <Grid item xs>
        <Collapse in={showNotes}>
          <List dense disablePadding>
            {notes.map((note, index) => {
              const dateCreated = utils.format(note.dateCreated, 'MM/dd/yyyy');
              const userName = `${note.user.firstName} ${note.user.lastName}`;
              return (
                <ListItem
                  dense
                  key={index}
                  className={classes.listItem}
                  disableGutters
                >
                  <ListItemText
                    primary={note.note}
                    secondary={`${dateCreated} - ${userName}`}
                  />
                </ListItem>
              );
            })}
          </List>
        </Collapse>

        <Field
          name={`${lineItem}.addNote`}
          multiline
          fullWidth
          placeholder="Add Note"
          component={DebouncedTextField}
          margin="dense"
        />
      </Grid>
    </Grid>
  );
};

let LineItemNotes = ({
  index,
  id,
  lineItem,
  form,
  user,
  notes,
  saveNote,
  readNotes
}) => {
  const smAndDown = useMediaQueryWithTheme(theme =>
    theme.breakpoints.down('sm')
  );

  const unreadNotes = useMemo(() => getUnreadNotes(user)(notes), [user, notes]);

  const clearUnread = useCallback(() => {
    if (!notes) return;
    if (!notes.length) return;

    if (unreadNotes && unreadNotes.length) {
      readNotes({ notes: unreadNotes, user });
    }
  }, [notes, unreadNotes, user, readNotes]);

  return smAndDown ? (
    <ExpansionNotes
      index={index}
      id={id}
      form={form}
      user={user}
      saveNote={saveNote}
      notes={notes}
      lineItem={lineItem}
      unreadNotes={unreadNotes}
      onOpen={clearUnread}
    />
  ) : (
    <DialogNotes
      index={index}
      id={id}
      form={form}
      user={user}
      saveNote={saveNote}
      notes={notes}
      unreadNotes={unreadNotes}
      onOpen={clearUnread}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
    notes: noteSelector(state, props)
  };
};

const mapDispatchToProps = {
  saveNote,
  readNotes
};

LineItemNotes = connect(
  mapStateToProps,
  mapDispatchToProps
)(LineItemNotes);

export default React.memo(LineItemNotes);
