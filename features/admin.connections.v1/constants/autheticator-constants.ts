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

import { IdentityAppsError } from "@wso2is/core/errors";

/**
 * Class containing authenticator management constants.
 */
export class AuthenticatorManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    public static readonly PASSIVE_STS_AUTHENTICATOR_NAME: string = "PassiveSTSAuthenticator";
    public static readonly SAML_AUTHENTICATOR_NAME: string = "SAMLSSOAuthenticator";
    public static readonly OIDC_AUTHENTICATOR_NAME: string = "OpenIDConnectAuthenticator";
    public static readonly LEGACY_EMAIL_OTP_AUTHENTICATOR_NAME: string = "EmailOTP";
    public static readonly SMS_OTP_AUTHENTICATOR_NAME: string = "SMSOTP";
    public static readonly ORGANIZATION_SSO_AUTHENTICATOR_NAME: string = "OrganizationAuthenticator";
    public static readonly ORGANIZATION_AUTHENTICATOR: string = "SSO";

    // Federated Authenticators
    public static readonly IPROOV_AUTHENTICATOR_NAME: string = "IproovAuthenticator";

    // Keys for the initial values of SMS OTP Authenticator
    public static readonly AUTHENTICATOR_INIT_VALUES_SMS_OTP_EXPIRY_TIME_KEY: string = "SmsOTP_ExpiryTime";

    // Keys for the initial values of Email OTP Authenticator
    public static readonly AUTHENTICATOR_INIT_VALUES_EMAIL_OTP_EXPIRY_TIME_KEY: string = "EmailOTP_ExpiryTime";

    /**
	 * UUID of the Multi-Factor Authenticators governance connector category.
	 */
    public static readonly MFA_CONNECTOR_CATEGORY_ID: string = "TXVsdGkgRmFjdG9yIEF1dGhlbnRpY2F0b3Jz";

    /**
     * Set of internal idps which are forbidden from deleting.
     * // TODO: Remove this once validating is available from the backend level.
     */
    public static readonly DELETING_FORBIDDEN_IDPS: string[] = [];

    public static readonly ERROR_IN_CREATING_SMS_NOTIFICATION_SENDER: string = "An error occurred while adding SMS " +
        "Notification Sender";

    public static readonly ERROR_IN_DELETING_SMS_NOTIFICATION_SENDER: string = "An error occurred while deleting " +
        "SMS Notification Sender";

    public static readonly ERROR_IN_FETCHING_FEDERATED_AUTHENTICATOR_META_DATA: string = "Failed to get " +
        "federated authenticator meta details";

    public static ErrorMessages: {
        SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS: IdentityAppsError;
        SMS_NOTIFICATION_SENDER_DELETION_ERROR_CONNECTED_APPS: IdentityAppsError;
    } = {
            SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS: new IdentityAppsError(
                "NSM-65015",
                "Failed to delete SMS notification sender due to the existence of active subscriptions"
            ),
            SMS_NOTIFICATION_SENDER_DELETION_ERROR_CONNECTED_APPS: new IdentityAppsError(
                "NSM-60008",
                "There are applications using this connection."
            )
        };

    public static readonly DEPRECATED_SCIM1_PROVISIONING_CONNECTOR_ID: string = "c2NpbQ";
}
