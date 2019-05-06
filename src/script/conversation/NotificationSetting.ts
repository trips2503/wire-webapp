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

import {t} from 'Util/LocalizerUtil';

/* tslint:disable:object-literal-sort-keys */
enum STATE {
  EVERYTHING = 0b00,
  MENTIONS_AND_REPLIES = 0b01,
  NOTHING = 0b11,
}
/* tslint:enable:object-literal-sort-keys */

const getText = (status: STATE) => {
  const statusTexts: Record<STATE, string> = {
    [STATE.EVERYTHING]: t('notificationSettingsEverything'),
    [STATE.MENTIONS_AND_REPLIES]: t('notificationSettingsMentionsAndReplies'),
    [STATE.NOTHING]: t('notificationSettingsNothing'),
  };
  return statusTexts[status];
};

export const NotificationSetting = {
  STATE,
  getText,
};