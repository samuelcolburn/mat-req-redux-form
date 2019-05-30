import React, { useState, useRef } from 'react';

import memoize from 'memoize-one';

import Downshift from 'downshift';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import FormControl from '@material-ui/core/FormControl';
// import InputBase from '@material-ui/core/InputBase';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import CloseIcon from '@material-ui/icons/Close';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles } from '@material-ui/core/styles';

import { FixedSizeList, areEqual } from 'react-window';

import AutocompleteResults from './AutocompleteResults';

import { toBoolean } from '../helpers';

const ControllerButton = ({
  classes,
  selectedItem,
  clearSelection,
  toggleMenu,
  disabled
}) => (
  <InputAdornment
    position="end"
    disablePointerEvents={disabled}
    className={classes.inputAdornment}
  >
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

const ITEM_HEIGHT = 36;
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
      disableGutters
      key={item.id}
      {...getItemProps({
        item,
        index,
        selected: highlightedIndex === index,
        style: {
          fontWeight: selectedItem.id === item.id ? 500 : 400,
          minHeight: ITEM_HEIGHT,
          paddingLeft: 8,
          paddingRight: 8,
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
    // top: props => (props.margin && props.margin === 'dense' ? 26 : 40),
    maxHeight: 300,
    overflowY: 'auto'
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  inputRoot: {
    flexWrap: 'nowrap'
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
    paddingBottom: theme.spacing(2)
  },
  inputAdornment: {
    marginLeft: 0
  },
  iconButton: {
    padding: 0,
    marginRight: 0
  },
  resultsError: {
    color: theme.palette.error.main
  }
}));

const getInputHeight = ref => {
  try {
    return ref && ref.current
      ? ref.current.computedStyleMap().get('margin-top').value +
          ref.current.scrollHeight
      : 0;
  } catch (error) {
    console.log(error);
    console.log('error getInputHeight, ref: ', ref);
  }
};

let AutoComplete = props => {
  const classes = useStyles(props);
  const {
    input,
    meta,
    label,
    placeholder,
    itemToString,
    table,
    params,
    disabled,
    margin,
    InputProps,
    ...rest
  } = props;

  const [inputValue, setInputValue] = useState(itemToString(input.value));
  const inputRef = useRef(null);

  function onInputValueChange(inputValue, stateAndHelpers) {
    setInputValue(inputValue);
    if (!inputValue || !inputValue.length) input.onChange(null);
  }

  const handleFocus = event => {
    console.log('handleFocus: ', input.name);
    input.onFocus(input.value);
  };

  const handleBlur = event => {
    console.log('handleBlur', input.name);
    input.onBlur(input.value);
  };

  const listRef = useRef(null);

  const onStateChange = (changes, stateAndHelpers) => {
    console.log('Downshift: onStateChange: ', changes, stateAndHelpers);
    if (
      changes.hasOwnProperty('highlightedIndex') &&
      listRef.current !== null
    ) {
      listRef.current.scrollToItem(changes.highlightedIndex);
    }

    if (changes.type === Downshift.stateChangeTypes.blurInput) {
      console.log('Downshift: blurred input: ', changes);
      input.onBlur(input.value);
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
        getItemProps,
        getMenuProps,
        getLabelProps,
        getToggleButtonProps,

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
          {
            <FormControl error={meta.error && meta.touched} fullWidth>
              {label && (
                <InputLabel
                  {...getLabelProps({
                    error: meta.error && meta.touched,
                    disabled,
                    shrink: toBoolean(
                      (placeholder && placeholder.length) ||
                        (inputValue && inputValue.length)
                    ),
                    htmlFor: input.name,
                    margin
                  })}
                >
                  {label}
                </InputLabel>
              )}
              <Input
                {...getInputProps({
                  disabled,
                  margin,
                  error: meta.error && meta.touched,
                  classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput
                  },
                  onBlur: handleBlur,
                  onFocus: handleFocus,
                  endAdornment: (
                    <ControllerButton
                      {...getToggleButtonProps({
                        classes,
                        clearSelection,
                        toggleMenu,
                        selectedItem,
                        disabled
                      })}
                    />
                  ),
                  inputProps: {
                    name: input.name,
                    placeholder
                  },
                  ref: inputRef,
                  ...InputProps
                })}
              />
              {meta.error && meta.touched ? (
                <FormHelperText>{meta.error}</FormHelperText>
              ) : null}
            </FormControl>
          }
          {isOpen ? (
            <Paper
              className={classes.paper}
              square
              {...getMenuProps()}
              style={{
                top: getInputHeight(inputRef)
              }}
            >
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
                          height={
                            data.length < 7 ? data.length * ITEM_HEIGHT : 300
                          }
                          width="100%"
                          itemSize={ITEM_HEIGHT}
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

export default React.memo(AutoComplete);
