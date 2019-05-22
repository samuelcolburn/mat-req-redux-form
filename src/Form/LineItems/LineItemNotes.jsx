import React, { useContext, useState } from 'react';
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

import { MuiPickersContext } from 'material-ui-pickers';

import {
  usePopupState,
  bindTrigger,
  bindPopover
} from 'material-ui-popup-state/hooks';

import useMediaQueryWithTheme from '../../components/useMediaQueryWithTheme';
import DebouncedTextField from '../../components/DebouncedTextField';

import { saveNote } from '../../actions';
import { noteSelector } from '../../selectors';
import { InputAdornment } from '@material-ui/core';

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
    note.user === user ||
    (note &&
      note.readBy &&
      note.readBy.split(';').some(reader => reader === user))
  );

const unreadNotesCount = user => notes =>
  notes.filter(userHasNotReadNote(user)).length;

const DialogNotes = ({ index, id, form, user, saveNote, notes }) => {
  const classes = useDialogStyles();

  const popupState = usePopupState({
    variant: 'popover',
    popupId: `line_item_notes_${id}`
  });

  const utils = useContext(MuiPickersContext);
  const [value, setValue] = useState('');

  const focusedInput = React.useCallback(node => {
    if (node !== null) {
      node.focus();
    }
  }, []);

  function handleClick(event) {
    popupState.open(event);
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
        <Badge badgeContent={unreadNotesCount(user)(notes)} color="primary">
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
        <Paper className={classes.paper}>
          <List dense disablePadding>
            {notes.map((note, index) => {
              const dateCreated = utils.format(note.dateCreated, 'MM/dd/yyyy');
              const userName = `${note.firstName} ${note.lastName}`;
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
      </Popover>
    </React.Fragment>
  );
};

const useExpansionStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(4)
  }
}));

const ExpansionNotes = props => {
  const {
    lineItem,
    index,
    fields,
    job,
    shopDrawing,
    id,
    form,
    user,
    saveNote,
    notes
  } = props;
  const classes = useExpansionStyles();
  const utils = useContext(MuiPickersContext);
  const [showNotes, setShowNotes] = useState(false);
  const unreadCount = unreadNotesCount(user)(notes);

  function handleClick(e) {
    setShowNotes(prev => !prev);
  }

  return (
    <Grid container alignItems="flex-start">
      <IconButton
        onClick={handleClick}
        size="small"
        disabled={unreadCount <= 0}
        className={classes.button}
      >
        <Badge badgeContent={unreadCount} color="primary">
          <ChatIcon />
        </Badge>
      </IconButton>

      <Grid item xs>
        <Collapse in={showNotes}>
          <List dense disablePadding>
            {notes.map((note, index) => {
              const dateCreated = utils.format(note.dateCreated, 'MM/dd/yyyy');
              const userName = `${note.firstName} ${note.lastName}`;
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

let LineItemNotes = props => {
  const smAndDown = useMediaQueryWithTheme(theme =>
    theme.breakpoints.down('sm')
  );

  return smAndDown ? <ExpansionNotes {...props} /> : <DialogNotes {...props} />;
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser.email,
    notes: noteSelector(state, props)
  };
};

const mapDispatchToProps = {
  saveNote
};

LineItemNotes = connect(
  mapStateToProps,
  mapDispatchToProps
)(LineItemNotes);

export default LineItemNotes;
