import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { push } from "react-router-redux";
import _ from "underscore";
import { connect } from "react-redux";

import Databases from "metabase/entities/databases";
import Groups from "metabase/entities/groups";

import { getIsDirty, getDiff } from "../../selectors/data-permissions";
import {
  saveDataPermissions,
  loadDataPermissions,
  initializeDataPermissions,
} from "../../permissions";
import { PermissionsEditBar } from "../../components/PermissionsPageLayout/PermissionsEditBar";
import { PermissionsPageLayout } from "../../components/PermissionsPageLayout/PermissionsPageLayout";
import { withRouter } from "react-router";
import { useLeaveConfirmation } from "../../hooks/use-leave-confirmation";

const propTypes = {
  children: PropTypes.node.isRequired,
  isDirty: PropTypes.bool,
  diff: PropTypes.object,
  savePermissions: PropTypes.func.isRequired,
  loadPermissions: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  navigateToTab: PropTypes.func.isRequired,
  navigateToLocation: PropTypes.func.isRequired,
  router: PropTypes.object,
  route: PropTypes.object,
};

function DataPermissionsPage({
  children,
  isDirty,
  diff,
  savePermissions,
  loadPermissions,
  initialize,
  navigateToTab,
  router,
  route,
  navigateToLocation,
}) {
  useEffect(() => {
    initialize();
  }, [initialize]);

  const beforeLeaveConfirmation = useLeaveConfirmation({
    router,
    route,
    onConfirm: navigateToLocation,
    isEnabled: isDirty,
  });

  return (
    <PermissionsPageLayout
      tab="data"
      onChangeTab={navigateToTab}
      confirmBar={
        isDirty && (
          <PermissionsEditBar
            diff={diff}
            isDirty={isDirty}
            onSave={savePermissions}
            onCancel={loadPermissions}
          />
        )
      }
    >
      {children}
      {beforeLeaveConfirmation}
    </PermissionsPageLayout>
  );
}

DataPermissionsPage.propTypes = propTypes;

const mapDispatchToProps = {
  loadPermissions: loadDataPermissions,
  savePermissions: saveDataPermissions,
  initialize: initializeDataPermissions,
  navigateToTab: tab => push(`/admin/permissions/${tab}`),
  navigateToLocation: location => push(location.pathname, location.state),
};

const mapStateToProps = (state, props) => ({
  isDirty: getIsDirty(state, props),
  diff: getDiff(state, props),
});

export default _.compose(
  withRouter,
  Databases.loadList({ entityQuery: { include: "tables" } }),
  Groups.loadList(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DataPermissionsPage);
