/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import {t, Declension, joinNames} from 'Util/LocalizerUtil';
import {capitalizeFirstChar} from 'Util/StringUtil';

import {WebAppEvents} from '../../event/WebApp';
import {VerificationMessageType} from '../../message/VerificationMessageType';
import {SuperType} from '../../message/SuperType';
import {Message} from './Message';

export class VerificationMessage extends Message {
  constructor() {
    super();

    this.super_type = SuperType.VERIFICATION;
    this.affect_order(false);
    this.verificationMessageType = ko.observable();

    this.userEntities = ko.observableArray();
    this.userIds = ko.observableArray();

    this.isSelfClient = ko.pureComputed(() => {
      return this.userIds().length === 1 && this.userIds()[0] === this.user().id;
    });

    this.isTypeNewDevice = ko.pureComputed(() => {
      return this.verificationMessageType() === VerificationMessageType.NEW_DEVICE;
    });
    this.isTypeNewMember = ko.pureComputed(() => {
      return this.verificationMessageType() === VerificationMessageType.NEW_MEMBER;
    });
    this.isTypeUnverified = ko.pureComputed(() => {
      return this.verificationMessageType() === VerificationMessageType.UNVERIFIED;
    });
    this.isTypeVerified = ko.pureComputed(() => {
      return this.verificationMessageType() === VerificationMessageType.VERIFIED;
    });

    this.captionUser = ko.pureComputed(() => {
      const namesString = joinNames(this.userEntities(), Declension.NOMINATIVE);
      return capitalizeFirstChar(namesString);
    });

    this.captionStartedUsing = ko.pureComputed(() => {
      const hasMultipleUsers = this.userIds().length > 1;
      return hasMultipleUsers ? t('conversationDeviceStartedUsingMany') : t('conversationDeviceStartedUsingOne');
    });

    this.captionNewDevice = ko.pureComputed(() => {
      const hasMultipleUsers = this.userIds().length > 1;
      return hasMultipleUsers ? t('conversationDeviceNewDeviceMany') : t('conversationDeviceNewDeviceOne');
    });

    this.captionUnverifiedDevice = ko.pureComputed(() => {
      const [firstUserEntity] = this.userEntities();
      return this.isSelfClient()
        ? t('conversationDeviceYourDevices')
        : t('conversationDeviceUserDevices', firstUserEntity.first_name());
    });
  }

  clickOnDevice() {
    const topic = this.isSelfClient() ? WebAppEvents.PREFERENCES.MANAGE_DEVICES : WebAppEvents.SHORTCUT.PEOPLE;
    amplify.publish(topic);
  }
}
