/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Show, useRequiredScopes } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui"; // No specific rule found
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { LoadableComponentInterface, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import moment, { Moment } from "moment";
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { GroupConstants } from "../constants/group-constants";
import { GroupsInterface } from "../models/groups";

interface GroupListProps extends SBACInterface<FeatureConfigInterface>,
    LoadableComponentInterface, TestableComponentInterface {
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Groups list.
     */
    groupList: GroupsInterface[];
    /**
     * Group delete callback.
     * @param group - Deleting group.
     */
    handleGroupDelete?: (group: GroupsInterface) => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, group: GroupsInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show/Hide meta content.
     */
    showMetaContent?: boolean;
    /**
     * Indicates whether the currently selected user store is read-only or not.
     */
    isReadOnlyUserStore?: boolean;
    /**
     * Flag to show/hide the delete action in the userstore list.
     */
    isUserstoreDeleteDisabled?: boolean;
    /**
     * Flag to show/hide the add action in the userstore list.
     */
    isUserstoreAddDisabled?: boolean;
}

/**
 * List component for Group Management list
 *
 * @param props - Props injected to the component.
 * @returns Groups list component.
 */
export const GroupList: React.FunctionComponent<GroupListProps> = (props: GroupListProps): ReactElement => {

    const {
        defaultListItemLimit,
        handleGroupDelete,
        isLoading,
        featureConfig,
        onEmptyListPlaceholderActionClick,
        onListItemClick,
        onSearchQueryClear,
        groupList,
        selection,
        searchQuery,
        showListItemActions,
        showMetaContent,
        isReadOnlyUserStore,
        isUserstoreAddDisabled,
        isUserstoreDeleteDisabled,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const { readOnlyUserStoreNamesList: readOnlyUserStores } = useUserStores();

    const [ showGroupDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ currentDeletedGroup, setCurrentDeletedGroup ] = useState<GroupsInterface>();

    const hasGroupsUpdatePermission: boolean = useRequiredScopes(featureConfig?.groups?.scopes?.update);
    const hasGroupsDeletePermission: boolean = useRequiredScopes(featureConfig?.groups?.scopes?.delete);

    const handleGroupEdit = (groupId: string): void => {
        history.push(AppConstants.getPaths().get("GROUP_EDIT").replace(":id", groupId));
    };

    /**
     * Shows list placeholders.
     *
     * @returns Empty placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-search-empty-placeholder` }
                    action={ (
                        <LinkButton
                            data-testid={ `${ testId }-search-empty-placeholder-clear-button` }
                            onClick={ onSearchQueryClear }
                        >
                            { t("roles:list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("roles:list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("roles:list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("roles:list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (isEmpty(groupList) || groupList.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-empty-list-empty-placeholder` }
                    action={ !isReadOnlyUserStore && !isUserstoreAddDisabled && (
                        <Show
                            when={ featureConfig?.groups?.scopes?.create }
                        >
                            <PrimaryButton
                                data-testid={ `${ testId }-empty-list-empty-placeholder-add-button` }
                                onClick={ onEmptyListPlaceholderActionClick }
                            >
                                <Icon name="add"/>
                                { t("roles:list.emptyPlaceholders.emptyRoleList.action",
                                    { type: "Group" }) }
                            </PrimaryButton>
                        </Show>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={
                        (isReadOnlyUserStore || isUserstoreAddDisabled)
                            ? t("roles:list.emptyPlaceholders.emptyRoleList.emptyRoles",
                                { type: "groups" })
                            : t("roles:list.emptyPlaceholders.emptyRoleList.title",
                                { type: "group" })
                    }
                    subtitle={
                        (isReadOnlyUserStore || isUserstoreAddDisabled)
                            ? [
                                t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.0",
                                    { type: "groups" })
                            ]
                            : [
                                t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.0",
                                    { type: "groups" }),
                                t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.1",
                                    { type: "group" }),
                                t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.2",
                                    { type: "group" })
                            ]
                    }
                />
            );
        }

        return null;
    };

    /**
     * Resolves data table columns.
     *
     * @returns Table Columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (group: GroupsInterface): ReactNode => {
                    const groupNameSegments: string[] = group?.displayName?.split("/");
                    const groupName: string = groupNameSegments?.length > 1
                        ? groupNameSegments[1]
                        : groupNameSegments[0];

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${ testId }-item-heading` }
                        >
                            <AppAvatar
                                image={ (
                                    <AnimatedAvatar
                                        name={ groupName }
                                        size="mini"
                                        data-testid={ `${ testId }-item-image-inner` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-testid={ `${ testId }-item-image` }
                            />
                            <Header.Content>
                                { groupName }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:manage.features.groups.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "lastModified",
                hidden: !showMetaContent,
                id: "lastModified",
                key: "lastModified",
                render: (group: GroupsInterface): ReactNode => {
                    const now: Moment = moment(new Date());
                    const receivedDate: Moment = moment(group.meta.lastModified ?
                        group.meta.lastModified :
                        group.meta.created
                    );

                    return t("console:common.dateTime.humanizedDateString", {
                        date: moment.duration(now.diff(receivedDate)).humanize()
                    });
                },
                title: t("console:manage.features.groups.list.columns.lastModified")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("console:manage.features.groups.list.columns.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @returns Table Actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        const actions: TableActionsInterface[] = [
            {
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.groups,
                    GroupConstants.FEATURE_DICTIONARY.get("GROUP_READ")),
                icon: (group: GroupsInterface): SemanticICONS => {
                    const userStore: string = group?.displayName?.split("/").length > 1
                        ? group?.displayName?.split("/")[0]
                        : userstoresConfig?.primaryUserstoreName;

                    return !isFeatureEnabled(featureConfig?.groups,
                        GroupConstants.FEATURE_DICTIONARY.get("GROUP_UPDATE"))
                    || !hasGroupsUpdatePermission
                    || readOnlyUserStores?.includes(userStore.toString())
                        ? "eye"
                        : "pencil alternate";
                },
                onClick: (e: SyntheticEvent, group: GroupsInterface): void =>
                    handleGroupEdit(group.id),
                popupText: (group: GroupsInterface): string => {
                    const userStore: string = group?.displayName?.split("/").length > 1
                        ? group?.displayName?.split("/")[0]
                        : userstoresConfig?.primaryUserstoreName;

                    return !isFeatureEnabled(featureConfig?.groups,
                        GroupConstants.FEATURE_DICTIONARY.get("GROUP_UPDATE"))
                    || !hasGroupsUpdatePermission
                    || readOnlyUserStores?.includes(userStore.toString())
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            }
        ];

        actions.push({
            hidden: (group: GroupsInterface): boolean => {
                const userStore: string = group?.displayName?.split("/").length > 1
                    ? group?.displayName?.split("/")[0]
                    : userstoresConfig?.primaryUserstoreName;

                return !hasGroupsDeletePermission
                    || readOnlyUserStores?.includes(userStore.toString())
                    || isReadOnlyUserStore
                    || isUserstoreDeleteDisabled;
            },
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, group: GroupsInterface): void => {
                setCurrentDeletedGroup(group);
                setShowDeleteConfirmationModal(!showGroupDeleteConfirmation);
            },
            popupText: (): string => t("roles:list.popups.delete", { type: "Group" }),
            renderer: "semantic-icon"
        });

        return actions;
    };

    return (
        <>
            <DataTable<GroupsInterface>
                className="groups-list"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ groupList ?? [] }
                onRowClick={
                    (e: SyntheticEvent, group: GroupsInterface): void => {
                        handleGroupEdit(group?.id);
                        onListItemClick && onListItemClick(e, group);
                    }
                }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
            {
                showGroupDeleteConfirmation &&
                    (<ConfirmationModal
                        data-testid={ `${ testId }-delete-item-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showGroupDeleteConfirmation }
                        assertionHint={ t("roles:list.confirmations.deleteItem.assertionHint") }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => {
                            handleGroupDelete(currentDeletedGroup);
                            setShowDeleteConfirmationModal(false);
                        } }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header>
                            { t("roles:list.confirmations.deleteItem.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            { t("roles:list.confirmations.deleteItem.message",
                                { type: "group" }) }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("roles:list.confirmations.deleteItem.content",
                                { type: "group" }) }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>)
            }
        </>
    );
};

/**
 * Default props for the component.
 */
GroupList.defaultProps = {
    selection: true,
    showListItemActions: true,
    showMetaContent: true
};
