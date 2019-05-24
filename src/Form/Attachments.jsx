import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { MuiPickersContext } from 'material-ui-pickers';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import MovieIcon from '@material-ui/icons/Movie';
import ImageIcon from '@material-ui/icons/Image';

import { getSelectedRequisitionAttachments } from '../selectors';
import AttachmentsField from '../components/AttachmentsField';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(8, 0)
  },
  header: {
    height: 30,
    margin: theme.spacing(4, 8)
  },
  title: {},
  container: {
    display: 'block',
    width: '100%'
  },
  itemContainer: {
    display: 'grid',
    gridTemplateColumns: '30px 5fr 6fr 2fr 2fr 2fr 30px',
    gridColumnGap: '4px',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr 1fr'
    }
  }
}));

const AttachmentIcon = ({ attachment }) => {
  const renderStrategies = {
    application: <InsertDriveFileIcon />,
    audio: <MusicVideoIcon />,
    image: <ImageIcon />,
    text: <InsertDriveFileIcon />,
    video: <MovieIcon />
  };

  return renderStrategies[attachment.fileType];
};

const AttachmentsListItem = props => {
  const utils = useContext(MuiPickersContext);
  const { attachment } = props;
  const dateCreated = utils.format(attachment.dateCreated, 'MM/dd/yyyy h:mma');
  return (
    <ListItem button>
      <ListItemIcon>
        <AttachmentIcon {...props} />
      </ListItemIcon>
      <ListItemText
        primary={attachment.name}
        secondary={`${dateCreated} - ${attachment.user.firstName} ${
          attachment.user.lastName
        }`}
      />
    </ListItem>
  );
};

const AttachmentsList = ({ attachments }) => (
  <List dense>
    {attachments.map(attachment => (
      <AttachmentsListItem key={attachment.id} attachment={attachment} />
    ))}
  </List>
);

let Attachments = props => {
  const { form, attachments } = props;

  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid container alignItems="center" className={classes.header}>
        <Typography variant="h6" component="h5" className={classes.title}>
          Attachments
        </Typography>
      </Grid>

      <Grid item xs={12}>
        {attachments && attachments.length ? (
          <AttachmentsList {...props} />
        ) : (
          'No Attachments'
        )}
      </Grid>

      <Grid item xs={12}>
        <AttachmentsField form={form} />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state, props) => ({
  attachments: getSelectedRequisitionAttachments(state, props)
});

const mapDispatchToProps = {};

Attachments = connect(
  mapStateToProps,
  mapDispatchToProps
)(Attachments);

export default Attachments;
