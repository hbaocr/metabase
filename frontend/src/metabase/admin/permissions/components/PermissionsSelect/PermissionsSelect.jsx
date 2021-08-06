import React, { useState } from "react";
import PropTypes from "prop-types";

import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
import { lighten } from "metabase/lib/colors";
import Icon from "metabase/components/Icon";
import Toggle from "metabase/components/Toggle";
import Tooltip from "metabase/components/Tooltip";

import {
  PermissionsSelectOption,
  optionShape,
} from "./PermissionsSelectOption";

import {
  PermissionsSelectRoot,
  OptionsList,
  OptionsListItem,
  ActionsList,
  ToggleContainer,
  ToggleLabel,
  WarningIcon,
} from "./PermissionsSelect.styled";

const propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape(optionShape)).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape(optionShape)),
  value: PropTypes.string.isRequired,
  toggleLabel: PropTypes.string,
  colorScheme: PropTypes.oneOf(["default", "admin"]),
  onChange: PropTypes.func.isRequired,
  onAction: PropTypes.func,
  isDisabled: PropTypes.bool,
  disabledTooltip: PropTypes.string,
  warning: PropTypes.string,
};

export function PermissionsSelect({
  options,
  actions,
  value,
  toggleLabel,
  colorScheme,
  onChange,
  onAction,
  isDisabled,
  disabledTooltip,
  warning,
}) {
  const [toggleState, setToggleState] = useState(false);
  const selected = options.find(option => option.value === value);
  const selectableOptions = options.filter(option => option !== selected);

  const shouldShowDisabledTooltip = isDisabled;
  const selectedValue = (
    <Tooltip tooltip={disabledTooltip} isEnabled={shouldShowDisabledTooltip}>
      <PermissionsSelectRoot isDisabled={isDisabled}>
        <PermissionsSelectOption {...selected} />
        {warning && (
          <Tooltip tooltip={warning}>
            <WarningIcon />
          </Tooltip>
        )}
        <Icon
          name="chevrondown"
          size={16}
          color={lighten("text-light", 0.15)}
        />
      </PermissionsSelectRoot>
    </Tooltip>
  );

  const actionsForCurrentValue = actions?.[selected.value] || [];
  const hasActions = actionsForCurrentValue.length > 0;

  return (
    <PopoverWithTrigger
      disabled={isDisabled}
      triggerElement={selectedValue}
      targetOffsetX={16}
      targetOffsetY={8}
    >
      {({ onClose }) => (
        <React.Fragment>
          <OptionsList role="listbox">
            {selectableOptions.map(option => (
              <OptionsListItem
                role="option"
                key={option.value}
                colorScheme={colorScheme}
                onClick={() => {
                  onClose();
                  onChange(option.value, toggleLabel ? toggleState : null);
                }}
              >
                <PermissionsSelectOption {...option} />
              </OptionsListItem>
            ))}
          </OptionsList>
          {hasActions && (
            <ActionsList>
              {actionsForCurrentValue.map((action, index) => (
                <OptionsListItem
                  key={index}
                  role="option"
                  colorScheme={colorScheme}
                  onClick={() => {
                    onClose();
                    onAction(action);
                  }}
                >
                  <PermissionsSelectOption {...action} />
                </OptionsListItem>
              ))}
            </ActionsList>
          )}

          {toggleLabel && (
            <ToggleContainer>
              <ToggleLabel>{toggleLabel}</ToggleLabel>
              <Toggle small value={toggleState} onChange={setToggleState} />
            </ToggleContainer>
          )}
        </React.Fragment>
      )}
    </PopoverWithTrigger>
  );
}

PermissionsSelect.propTypes = propTypes;
