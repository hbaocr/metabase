/* eslint-disable react/prop-types */
import React, { useCallback } from "react";
import { push } from "react-router-redux";
import { t } from "ttag";
import _ from "underscore";
import { connect } from "react-redux";

import {
  getGroupsDataPermissionEditor,
  getDatabasesSidebar,
} from "../../selectors/data-permissions";
import { updateDataPermission } from "../../permissions";

import { PermissionsSidebar } from "../../components/PermissionsSidebar";
import {
  PermissionsEditor,
  PermissionsEditorEmptyState,
} from "../../components/PermissionsEditor";

function DatabasesPermissionsPage({
  params,
  children,
  sidebar,
  permissionEditor,

  navigateToItem,
  navigateToDatabaseList,
  switchView,
  updateDataPermission,
  dispatch,
}) {
  const handleEntityChange = useCallback(
    entityType => {
      switchView(entityType);
    },
    [switchView],
  );

  const handlePermissionChange = useCallback(
    async (item, permission, value) => {
      await updateDataPermission({
        groupId: item.id,
        permission,
        value,
        entityId: params,
        view: "database",
      });
    },
    [params, updateDataPermission],
  );

  const handleAction = (action, item) => {
    dispatch(action.actionCreator(item.id, params, "database"));
  };

  return (
    <React.Fragment>
      <PermissionsSidebar
        {...sidebar}
        onSelect={navigateToItem}
        onBack={params.databaseId == null ? null : navigateToDatabaseList}
        onEntityChange={handleEntityChange}
      />

      {!permissionEditor && (
        <PermissionsEditorEmptyState
          icon="database"
          message={t`Select a database to see group permissions`}
        />
      )}

      {permissionEditor && (
        <PermissionsEditor
          {...permissionEditor}
          onBreadcrumbsItemSelect={navigateToItem}
          onChange={handlePermissionChange}
          onAction={handleAction}
        />
      )}

      {children}
    </React.Fragment>
  );
}

const BASE_PATH = `/admin/permissions/data/database/`;

const mapDispatchToProps = {
  updateDataPermission,
  switchView: entityType => push(`/admin/permissions/data/${entityType}`),
  navigateToDatabaseList: () => push(BASE_PATH),
  navigateToItem: item => {
    switch (item.type) {
      case "database":
        return push(`${BASE_PATH}${item.id}`);
      case "schema":
        return push(`${BASE_PATH}${item.databaseId}/schema/${item.name}`);
      case "table":
        return push(
          `${BASE_PATH}${item.databaseId}/schema/${item.schemaName}/table/${item.originalId}`,
        );
    }

    return push(BASE_PATH);
  },
};

const mapStateToProps = (state, props) => {
  return {
    sidebar: getDatabasesSidebar(state, props),
    permissionEditor: getGroupsDataPermissionEditor(state, props),
  };
};

export default _.compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DatabasesPermissionsPage);
