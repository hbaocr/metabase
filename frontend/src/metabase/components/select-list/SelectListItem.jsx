import React from "react";
import PropTypes from "prop-types";
import _ from "underscore";

import { iconPropTypes } from "metabase/components/Icon";
import { useScrollOnMount } from "metabase/hooks/use-scroll-on-mount";

import { ItemRoot, ItemIcon, ItemTitle } from "./SelectListItem.styled";

const propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, iconPropTypes]).isRequired,
  iconColor: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  hasRightArrow: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium"]),
};

export function SelectListItem({
  id,
  name,
  icon,
  onSelect,
  isSelected = false,
  isHighlighted = false,
  hasRightArrow = false,
  size = "medium",
}) {
  const ref = useScrollOnMount();
  const iconProps = _.isObject(icon) ? icon : { name: icon };
  return (
    <ItemRoot
      innerRef={isSelected ? ref : null}
      isSelected={isSelected}
      role="menuitem"
      tabIndex={0}
      size={size}
      onClick={() => onSelect(id)}
      onKeyDown={e => e.key === "Enter" && onSelect(id)}
    >
      <ItemIcon color="brand" {...iconProps} isHighlighted={isHighlighted} />
      <ItemTitle>{name}</ItemTitle>
      {hasRightArrow && <ItemIcon name="chevronright" />}
    </ItemRoot>
  );
}

SelectListItem.propTypes = propTypes;
