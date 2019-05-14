import React, { useState, useRef } from 'react';

import memoize from 'memoize-one';

import Downshift from 'downshift';

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import CloseIcon from '@material-ui/icons/Close';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles } from '@material-ui/core/styles';

import { FixedSizeList, areEqual } from 'react-window';

import AutocompleteResults from './AutocompleteResults';

const ControllerButton = ({
  classes,
  selectedItem,
  clearSelection,
  toggleMenu
}) => (
  <InputAdornment position="end">
    {selectedItem ? (
      <IconButton
        edge="end"
        aria-label="Clear Selection"
        onClick={clearSelection}
        className={classes.iconButton}
      >
        <CloseIcon />
      </IconButton>
    ) : (
      <IconButton
        edge="end"
        aria-label="Open Selection Menu"
        onClick={toggleMenu}
        className={classes.iconButton}
      >
        <ArrowDownIcon />
      </IconButton>
    )}
  </InputAdornment>
);

function renderInput(inputProps) {
  const {
    error,
    touched,
    InputProps,
    endAdornment,
    classes,
    ref,
    ...other
  } = inputProps;

  return (
    <TextField
      helperText={error && touched ? error : null}
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps,
        endAdornment
      }}
      {...other}
    />
  );
}

const SuggestionRenderer = React.memo(({ index, style, data }) => {
  const {
    getItemProps,
    highlightedIndex,
    selectedItem,
    itemToString,
    items
  } = data;

  const item = items[index];

  return (
    <MenuItem
      key={item.id}
      {...getItemProps({
        item,
        index,
        selected: highlightedIndex === index,
        style: {
          fontWeight: selectedItem.id === item.id ? 500 : 400,
          ...style
        }
      })}
      component="div"
    >
      {itemToString(item)}
    </MenuItem>
  );
}, areEqual);

const createItemData = memoize(
  (items, itemToString, getItemProps, highlightedIndex, selectedItem) => ({
    items,
    itemToString,
    getItemProps,
    highlightedIndex,
    selectedItem
  })
);

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
    maxHeight: 300,
    overflowY: 'auto'
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  inputRoot: {
    flexWrap: 'wrap'
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1
  },
  iconButton: {
    padding: theme.spacing(2),
    marginRight: theme.spacing(2) * -1
  },
  resultsError: {
    color: theme.palette.error.main
  }
}));

let AutoComplete = ({
  input,
  meta,
  label,
  placeholder,
  itemToString,
  table,
  params,
  ...rest
}) => {
  const classes = useStyles();

  const [inputValue, setInputValue] = useState(itemToString(input.value));

  function onInputValueChange(inputValue, stateAndHelpers) {
    setInputValue(inputValue);
    if (!inputValue || !inputValue.length) input.onChange(null);
  }

  const handleKeyDown = event => {
    if (event.key === 'Delete') {
      input.onChange(null);
    }
  };

  const listRef = useRef(null);

  const onStateChange = (changes, stateAndHelpers) => {
    if (
      changes.hasOwnProperty('highlightedIndex') &&
      listRef.current !== null
    ) {
      listRef.current.scrollToItem(changes.highlightedIndex);
    }
  };

  return (
    <Downshift
      onChange={selectedItem => {
        input.onChange(selectedItem);
      }}
      selectedItem={input.value}
      // defaultIsOpen={true} // keep open during dev to see results
      itemToString={itemToString}
      inputValue={inputValue}
      onInputValueChange={onInputValueChange}
      onStateChange={onStateChange}
      defaultHighlightedIndex={0}
      {...rest}
    >
      {({
        getInputProps,
        getButtonProps,
        getItemProps,
        getMenuProps,

        isOpen,
        toggleMenu,
        clearSelection,
        selectedItem,
        inputValue,
        highlightedIndex,
        itemCount,
        setItemCount
      }) => (
        <div className={classes.container}>
          {renderInput({
            fullWidth: true,
            classes,
            error: meta.error,
            touched: meta.touched,
            endAdornment: (
              <ControllerButton
                classes={classes}
                clearSelection={clearSelection}
                toggleMenu={toggleMenu}
                selectedItem={selectedItem}
              />
            ),

            InputProps: getInputProps({
              placeholder,
              onKeyDown: handleKeyDown
            })
          })}
          {isOpen ? (
            <Paper className={classes.paper} square>
              {(() => {
                if (!isOpen) {
                  return null;
                }

                return (
                  <AutocompleteResults
                    table={table}
                    params={{ q: inputValue, ...params }}
                  >
                    {({ loading, error, data }) => {
                      if (loading) {
                        return <MenuItem>Loading...</MenuItem>;
                      }

                      if (error) {
                        return (
                          <MenuItem className={classes.resultsError}>
                            <ListItemIcon>
                              <ErrorIcon color="error" />
                            </ListItemIcon>
                            <ListItemText>{error}</ListItemText>
                          </MenuItem>
                        );
                      }

                      if (!data.length) {
                        return <MenuItem>No items match your search</MenuItem>;
                      }

                      if (itemCount !== data.length) setItemCount(data.length);

                      const itemData = createItemData(
                        data,
                        itemToString,
                        getItemProps,
                        highlightedIndex,
                        selectedItem
                      );

                      return (
                        <FixedSizeList
                          ref={listRef}
                          height={data.length < 7 ? data.length * 46 : 300}
                          width="100%"
                          itemSize={46}
                          itemCount={data.length}
                          itemData={itemData}
                        >
                          {SuggestionRenderer}
                        </FixedSizeList>
                      );
                    }}
                  </AutocompleteResults>
                );
              })()}
            </Paper>
          ) : null}
        </div>
      )}
    </Downshift>
  );
};

export default AutoComplete;
