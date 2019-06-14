import React, { useContext } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { MuiPickersContext } from '@material-ui/pickers';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';

import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import MovieIcon from '@material-ui/icons/Movie';
import ImageIcon from '@material-ui/icons/Image';

import { getSelectedRequisitionAttachments } from '../selectors';
import AttachmentsField from '../components/AttachmentsField';
import { Checkbox } from '@material-ui/core';

const AttachmentColumns = ({ form, classes }) => {
  return (
    <div className={classes.itemContainer}>
      {/* Select All checkbox */}
      <div className={classes.attributeContainer}>
        <Checkbox className={classes.selectedCheckbox} color="primary" />
      </div>

      {/* File Name */}
      <div className={classes.name}>
        <div>File</div>
      </div>

      {/* Upload Date, User */}
      <div className={clsx(classes.attributeContainer, classes.info)}>
        <div>Uploaded</div>
        <div>User</div>
      </div>
    </div>
  );
};

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
    gridTemplateColumns: '30px 4fr 2fr',
    gridColumnGap: '4px',
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr 1fr'
    }
  },
  attributeContainer: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(var(--column-width-min), 1fr))',
    alignItems: 'center',
    gridColumnGap: '4px'
  },
  icon: {
    padding: theme.spacing(4, 4, 4, 0)
  },
  name: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: 1
  },
  info: {
    '--column-width-min': '125px'
  },
  selectedWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedCheckbox: {
    height: 30,
    width: 30
  },
  item: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: 'relative',
    '&::before': {
      content: '""',
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.action.hover
    },
    '&:hover::before': {
      opacity: 1
    }
  }
}));

const AttachmentIcon = React.memo(({ classes, attachment }) => {
  const renderStrategies = {
    application: <InsertDriveFileIcon />,
    audio: <MusicVideoIcon />,
    image: <ImageIcon />,
    text: <InsertDriveFileIcon />,
    video: <MovieIcon />
  };

  return (
    <div className={classes.icon}>{renderStrategies[attachment.fileType]}</div>
  );
});

const AttachmentsListItem = props => {
  const utils = useContext(MuiPickersContext);

  const { classes, attachment } = props;

  const dateCreated = utils.format(attachment.dateCreated, 'MM/dd/yyyy h:mma');

  return (
    <div className={clsx(classes.itemContainer, classes.item)}>
      {/* Select All checkbox */}
      <div className={classes.attributeContainer}>
        <Checkbox className={classes.selectedCheckbox} />
      </div>

      {/* File Name */}
      <div className={classes.name}>
        <AttachmentIcon classes={classes} attachment={attachment} />

        <Typography variant="body2" component="div">
          {attachment.name}
        </Typography>
      </div>

      {/* Upload Date, User */}
      <div className={clsx(classes.attributeContainer, classes.info)}>
        <Typography variant="body2" component="div" color="textSecondary">
          {dateCreated}
        </Typography>
        <Typography variant="body2" component="div" color="textSecondary">
          {`${attachment.user.firstName} ${attachment.user.lastName}`}
        </Typography>
      </div>
    </div>
  );
};

const AttachmentsList = props => {
  return (
    <List dense>
      {props.attachments.map(attachment => (
        <AttachmentsListItem
          key={attachment.id}
          attachment={attachment}
          {...props}
        />
      ))}
    </List>
  );
};

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
        <div className={classes.container}>
          <Hidden smDown>
            <AttachmentColumns form={form} classes={classes} />
          </Hidden>

          <Divider
            variant="fullWidth"
            style={{ width: '100%' }}
            className={classes.itemContainer}
          />

          {props.attachments.map(attachment => (
            <AttachmentsListItem
              key={attachment.id}
              attachment={attachment}
              classes={classes}
            />
          ))}
        </div>
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
