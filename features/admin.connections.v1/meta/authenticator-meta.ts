/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import get from "lodash-es/get";
import { ReactNode, lazy } from "react";
import { getConnectionIcons } from "../configs/ui";
import { ConnectionManagementConstants } from "../constants/connection-constants";
import { FederatedAuthenticatorConstants } from "../constants/federated-authenticator-constants";
import { LocalAuthenticatorConstants } from "../constants/local-authenticator-constants";
import { AuthenticatorCategories, AuthenticatorLabels } from "../models/authenticators";
import { FederatedAuthenticatorInterface } from "../models/connection";

export class AuthenticatorMeta {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /**
     * Get the Authenticator description.
     *
     * @param authenticatorId - Authenticator ID.
     *
     * @returns Authenticator description.
     */
    public static getAuthenticatorDescription(authenticatorId: string): string {

        return get({
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .BASIC_AUTHENTICATOR_ID ]: "Login users with username and password " +
                "credentials.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Get users Identity first to " +
                "control the authentication flow.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .FIDO_AUTHENTICATOR_ID ]: "Login users with passkey, FIDO security key " +
                "or biometrics.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .TOTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
                "Time-Based One Time passcode.",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.OIDC_AUTHENTICATOR_ID ]: "Authenticate users with " +
                "Enterprise OIDC connections.",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SAML_AUTHENTICATOR_ID ]: "Authenticate users with " +
                "Enterprise SAML connections.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .EMAIL_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
                "one-time passcode sent via email.",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS
                .EMAIL_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication " +
                "using one-time passcode sent via email.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .SMS_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
                "SMS one-time passcode.",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS
                .SMS_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
                "SMS one-time passcode.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .MAGIC_LINK_AUTHENTICATOR_ID ]: "Email users a magic link to " +
                "log in passwordless",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .BACKUP_CODE_AUTHENTICATOR_ID ]: "Two-factor authentication " +
                "recovery option.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .X509_CERTIFICATE_AUTHENTICATOR_ID ]: "Authenticate clients using " +
                "client certificates."
        }, authenticatorId);
    }

    /**
     * Get Authenticator Labels.
     *
     * @param authenticatorId - Authenticator ID.
     *
     * @returns Authenticator labels.
     */
    public static getAuthenticatorLabels(authenticator: FederatedAuthenticatorInterface): string[] {

        const authenticatorId: string = authenticator?.authenticatorId;

        const authenticatorLabels: string[] = get({
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: [ AuthenticatorLabels.HANDLERS ],
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.FIDO_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.PASSWORDLESS, AuthenticatorLabels.PASSKEY
            ],
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.TOTP_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SECOND_FACTOR, AuthenticatorLabels.MULTI_FACTOR
            ],
            [ ConnectionManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SOCIAL, AuthenticatorLabels.OIDC
            ],
            [ ConnectionManagementConstants.GITHUB_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SOCIAL, AuthenticatorLabels.OIDC
            ],
            [ ConnectionManagementConstants.FACEBOOK_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SOCIAL, AuthenticatorLabels.OIDC
            ],
            [ ConnectionManagementConstants.TWITTER_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SOCIAL, AuthenticatorLabels.OIDC
            ],
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.OIDC_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.OIDC
            ],
            [ ConnectionManagementConstants.SAML_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SAML
            ],
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.EMAIL_OTP_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.PASSWORDLESS, AuthenticatorLabels.MULTI_FACTOR
            ],
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.SMS_OTP_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.MULTI_FACTOR
            ],
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.MAGIC_LINK_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.PASSWORDLESS
            ],
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.APPLE_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SOCIAL, AuthenticatorLabels.OIDC
            ],
            [ ConnectionManagementConstants.HYPR_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.PASSWORDLESS
            ],
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.IPROOV_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.PASSWORDLESS
            ],
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.HANDLERS
            ]
        }, authenticatorId, []);

        if (authenticator?.tags?.includes(AuthenticatorLabels.API_AUTHENTICATION)) {
            return [ ...authenticatorLabels, AuthenticatorLabels.API_AUTHENTICATION ];
        }

        return authenticatorLabels;
    }

    /**
     * Get Authenticator Type display name.
     *
     * @param type - Type.
     *
     * @returns Authenticator type display name.
     */
    public static getAuthenticatorTypeDisplayName(type: AuthenticatorCategories): string {

        return get({
            [ AuthenticatorCategories.ENTERPRISE ]: "applications:edit.sections.signOnMethod.sections."+
            "authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.enterprise.heading",
            [ AuthenticatorCategories.LOCAL ]: "applications:edit.sections.signOnMethod."+
            "sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.basic.heading",
            [ AuthenticatorCategories.SECOND_FACTOR ]: "applications:edit.sections.signOnMethod."+
            "sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.mfa.heading",
            [ AuthenticatorCategories.SOCIAL ]: "applications:edit.sections.signOnMethod."+
            "sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.social.heading",
            [ AuthenticatorCategories.RECOVERY ]: "applications:edit.sections.signOnMethod.sections."+
            "authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.backupCodes.heading"
        }, type);
    }

    /**
     * Get Authenticator Icon.
     *
     * @param authenticatorId - Authenticator ID.
     *
     * @returns Authenticator Icon.
     */
    public static getAuthenticatorIcon(authenticatorId: string): any {

        const icon: ReactNode = get({
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: getConnectionIcons()?.identifierFirst,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .JWT_BASIC_AUTHENTICATOR_ID ]: getConnectionIcons()?.jwtBasic,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.FIDO_AUTHENTICATOR_ID ]: getConnectionIcons()?.fido,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .X509_CERTIFICATE_AUTHENTICATOR_ID ]: getConnectionIcons()?.x509,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.TOTP_AUTHENTICATOR_ID ]: getConnectionIcons()?.totp,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.BASIC_AUTHENTICATOR_ID ]: getConnectionIcons()?.basic,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID ]: getConnectionIcons()?.sessionExecutor,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .EMAIL_OTP_AUTHENTICATOR_ID ]: getConnectionIcons()?.emailOTP,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.SMS_OTP_AUTHENTICATOR_ID ]: getConnectionIcons()?.smsOTP,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .MAGIC_LINK_AUTHENTICATOR_ID ]: getConnectionIcons()?.magicLink,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .BACKUP_CODE_AUTHENTICATOR_ID ]: getConnectionIcons()?.backupCode,
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS
                .ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID ]: getConnectionIcons()?.organizationSSO
        }, authenticatorId);

        return icon ?? getConnectionIcons().default;
    }

    /**
     * Get Authenticator Type display name.
     *
     * @param authenticatorId - Authenticator ID.
     *
     * @returns Authenticator type display name.
     */
    public static getAuthenticatorCategory(authenticatorId: string): string {

        return get({
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Predefined",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.FIDO_AUTHENTICATOR_ID ]: "Predefined",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.MAGIC_LINK_AUTHENTICATOR_ID ]: "Predefined",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.TOTP_AUTHENTICATOR_ID ]: "Predefined",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.OIDC_AUTHENTICATOR_ID ]: "OIDC",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SAML_AUTHENTICATOR_ID ]: "SAML",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.EMAIL_OTP_AUTHENTICATOR_ID ]: "Predefined",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.SMS_OTP_AUTHENTICATOR_ID ]: "Predefined"
        }, authenticatorId);
    }

    /**
     * Get the list of allowed filter tags in the UI.
     *
     * `/authenticators/meta/tags` API gives out all the tags which includes `Request-Path` etc.
     * Hence moderation has to be made.
     *
     * @returns List of allowed filter tags.
     */
    public static getAllowedFilterTags(): string[] {

        return [
            AuthenticatorLabels.MULTI_FACTOR,
            AuthenticatorLabels.PASSWORDLESS,
            AuthenticatorLabels.OIDC,
            AuthenticatorLabels.SOCIAL,
            AuthenticatorLabels.SAML,
            AuthenticatorLabels.PASSKEY,
            AuthenticatorLabels.API_AUTHENTICATION
        ];
    }

    /**
     * Get Authenticator template name.
     *
     * @param authenticatorId - Authenticator ID.
     *
     * @returns Authenticator template name.
     */
    public static getAuthenticatorTemplateName(authenticatorId: string): string {

        return get({
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.BASIC_AUTHENTICATOR_ID ]: "username-and-password",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.FIDO_AUTHENTICATOR_ID ]: "fido",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.TOTP_AUTHENTICATOR_ID ]: "totp",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.SMS_OTP_AUTHENTICATOR_ID ]: "sms-otp",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.EMAIL_OTP_AUTHENTICATOR_ID ]: "email-otp",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "identifier-first",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.OIDC_AUTHENTICATOR_ID ]: "enterprise-oidc",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SAML_AUTHENTICATOR_ID ]: "enterprise-saml"
        }, authenticatorId);
    }

    public static getAuthenticators(): any {
        return {
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.EMAIL_OTP_AUTHENTICATOR_ID ]: {
                content: {
                    quickStart: lazy(() => import(
                        "../components/authenticators/email-otp/quick-start"
                    ))
                },
                isComingSoon: false,
                isEnabled: true,
                useAuthenticatorsAPI: false
            },
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.SMS_OTP_AUTHENTICATOR_ID ]: {
                content: {
                    quickStart: lazy(() => import(
                        "../components/authenticators/sms-otp/quick-start"
                    ))
                },
                isComingSoon: false,
                isEnabled: true,
                useAuthenticatorsAPI: false
            },
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.TOTP_AUTHENTICATOR_ID ]: {
                content: {
                    quickStart: lazy(() => import(
                        "../components/authenticators/totp/quick-start"
                    ))
                },
                isComingSoon: false,
                isEnabled: true,
                useAuthenticatorsAPI: true
            },
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.FIDO_AUTHENTICATOR_ID ]: {
                content: {
                    quickStart: lazy(() => import(
                        "../components/authenticators/fido/quick-start"
                    ))
                },
                isComingSoon: false,
                isEnabled: true,
                useAuthenticatorsAPI: false
            },
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.MAGIC_LINK_AUTHENTICATOR_ID ]: {
                content: {
                    quickStart: lazy(() => import(
                        "../components/authenticators/magic-link/quick-start"
                    ))
                },
                isComingSoon: false,
                isEnabled: true,
                useAuthenticatorsAPI: true
            }
        };
    }
}
