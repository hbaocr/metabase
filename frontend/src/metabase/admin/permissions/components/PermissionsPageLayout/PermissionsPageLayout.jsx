import React from "react";
import PropTypes from "prop-types";

import fitViewport from "metabase/hoc/FitViewPort";

import { PermissionsTabs } from "./PermissionsTabs";
import { FullHeightContainer } from "./PermissionsPageLayout.styled";

const propTypes = {
  children: PropTypes.node.isRequired,
  tab: PropTypes.oneOf(["data", "collections"]).isRequired,
  onChangeTab: PropTypes.func.isRequired,
  confirmBar: PropTypes.node,
};

export const PermissionsPageLayout = fitViewport(
  function PermissionsPageLayout({ children, tab, onChangeTab, confirmBar }) {
    return (
      <FullHeightContainer flexDirection="column" style={{ height: "100%" }}>
        {confirmBar}
        <div className="border-bottom">
          <PermissionsTabs tab={tab} onChangeTab={onChangeTab} />
        </div>
        <FullHeightContainer style={{ height: "100%" }}>
          {children}
        </FullHeightContainer>
      </FullHeightContainer>
    );
  },
);

PermissionsPageLayout.propTypes = propTypes;
