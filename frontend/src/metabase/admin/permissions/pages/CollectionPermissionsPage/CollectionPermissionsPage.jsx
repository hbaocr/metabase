/* eslint-disable react/prop-types */
import React, { useEffect, useCallback } from "react";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { t } from "ttag";
import _ from "underscore";

import Groups from "metabase/entities/groups";
import Collections from "metabase/entities/collections";

import {
  PermissionsEditor,
  PermissionsEditorEmptyState,
} from "../../components/PermissionsEditor";
import { PermissionsPageLayout } from "../../components/PermissionsPageLayout/PermissionsPageLayout";
import {
  initializeCollectionPermissions,
  updateCollectionPermission,
  saveCollectionPermissions,
  loadCollectionPermissions,
} from "../../permissions";
import {
  getCollectionsSidebar,
  getCollectionsPermissionEditor,
  getCollectionEntity,
  getIsDirty,
  getDiff,
} from "../../selectors/collection-permissions";
import { PermissionsSidebar } from "../../components/PermissionsSidebar";
import { PermissionsEditBar } from "../../components/PermissionsPageLayout/PermissionsEditBar";
import { useLeaveConfirmation } from "../../hooks/use-leave-confirmation";

function CollectionsPermissionsPage({
  sidebar,
  permissionEditor,
  collection,

  isDirty,
  diff,
  savePermissions,
  loadPermissions,

  updateCollectionPermission,
  navigateToItem,
  navigateToTab,
  initialize,

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

  const handlePermissionChange = useCallback(
    (item, _permission, value, toggleState) => {
      updateCollectionPermission({
        groupId: item.id,
        collection,
        value,
        shouldPropagate: toggleState,
      });
    },
    [collection, updateCollectionPermission],
  );

  return (
    <PermissionsPageLayout
      tab="collections"
      onChangeTab={navigateToTab}
      confirmBar={
        isDirty && (
          <PermissionsEditBar
            diff={diff}
            isDirty={isDirty}
            onSave={savePermissions}
            onCancel={() => loadPermissions()}
          />
        )
      }
    >
      <PermissionsSidebar {...sidebar} onSelect={navigateToItem} />

      {!permissionEditor && (
        <PermissionsEditorEmptyState
          icon="all"
          message={t`Select a collection to see it's permissions`}
        />
      )}

      {permissionEditor && (
        <PermissionsEditor
          {...permissionEditor}
          onChange={handlePermissionChange}
        />
      )}

      {beforeLeaveConfirmation}
    </PermissionsPageLayout>
  );
}

const mapDispatchToProps = {
  initialize: initializeCollectionPermissions,
  loadPermissions: loadCollectionPermissions,
  navigateToTab: tab => push(`/admin/permissions/${tab}`),
  navigateToItem: ({ id }) => push(`/admin/permissions/collections/${id}`),
  updateCollectionPermission,
  savePermissions: saveCollectionPermissions,
  navigateToLocation: location => push(location.pathname, location.state),
};

const mapStateToProps = (state, props) => {
  return {
    sidebar: getCollectionsSidebar(state, props),
    permissionEditor: getCollectionsPermissionEditor(state, props),
    isDirty: getIsDirty(state, props),
    diff: getDiff(state, props),
    collection: getCollectionEntity(state, props),
  };
};

export default _.compose(
  Collections.loadList({
    query: () => ({ tree: true }),
  }),
  Groups.loadList(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(CollectionsPermissionsPage);
