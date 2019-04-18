import React, { useState } from "react";

import Downshift from "downshift";

import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import CloseIcon from "@material-ui/icons/Close";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { makeStyles } from "@material-ui/core/styles";

import AutocompleteResults from "./AutocompleteResults";

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
        aria-label="Toggle password visibility"
        onClick={clearSelection}
        className={classes.iconButton}
      >
        <CloseIcon />
      </IconButton>
    ) : (
      <IconButton
        edge="end"
        aria-label="Toggle password visibility"
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

function renderSuggestion({
  item,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
  itemToString
}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem.id === item.id;

  return (
    <MenuItem
      {...itemProps}
      key={item.id}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {itemToString(item)}
    </MenuItem>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  inputRoot: {
    flexWrap: "wrap"
  },
  inputInput: {
    width: "auto",
    flexGrow: 1
  },
  iconButton: {
    padding: theme.spacing(2),
    marginRight: theme.spacing(2) * -1
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

  const [inputValue, setInputValue] = useState("");

  function onInputValueChange(inputValue, stateAndHelpers) {
    console.log("onInputValueChange: ");
    console.log("inputValue: ", inputValue);
    console.log("stateAndHelpers: ", stateAndHelpers);
    setInputValue(inputValue);

    if (!inputValue || !inputValue.length) input.onChange(null);
  }

  const handleKeyDown = event => {
    if (event.key === "Delete") {
      input.onChange(null);
    }
  };

  return (
    <Downshift
      onChange={selectedItem => {
        input.onChange(selectedItem);
      }}
      selectedItem={input.value}
      // defaultIsOpen={true}
      itemToString={itemToString}
      inputValue={inputValue}
      onInputValueChange={onInputValueChange}
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
        highlightedIndex
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

                if (!inputValue) {
                  return <MenuItem>You have to enter a search query</MenuItem>;
                }

                return (
                  <AutocompleteResults
                    table={table}
                    params={{ q: inputValue, ...params }}
                  >
                    {({ loading, error, data: { items = [] } = {} }) => {
                      if (loading) {
                        return <MenuItem>Loading...</MenuItem>;
                      }

                      if (error) {
                        return <MenuItem>Error! ${error}</MenuItem>;
                      }

                      if (!items.length) {
                        return <MenuItem>No repositories found</MenuItem>;
                      }

                      return items.map((item, index) =>
                        renderSuggestion({
                          item,
                          index,
                          itemToString,
                          itemProps: getItemProps({ item }),
                          highlightedIndex,
                          selectedItem
                        })
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