/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as externs from '@firebase/auth-types-exp';

import { PhoneOrOauthTokenResponse } from '../../api/authentication/mfa';
import { AuthCore } from '../../model/auth';
import { IdTokenResponse } from '../../model/id_token';

export abstract class AuthCredential extends externs.AuthCredential {
  static fromJSON(json: object | string): AuthCredential | null;

  _getIdTokenResponse(auth: AuthCore): Promise<PhoneOrOauthTokenResponse>;
  _linkToIdToken(auth: AuthCore, idToken: string): Promise<IdTokenResponse>;
  _getReauthenticationResolver(auth: AuthCore): Promise<IdTokenResponse>;
}
