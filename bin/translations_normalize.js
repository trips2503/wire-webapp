#!/usr/bin/env node

/*
 * Wire
 * Copyright (C) 2019 Wire Swiss GmbH
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

const fs = require('fs-extra');
const authTranslations = require('../temp/i18n/src/script/strings');
const webappTranslations = require('../resource/translation/en-US.json');

const normalizedAuthTranslations = authTranslations.reduce(
  (accumulator, object) => ({
    ...accumulator,
    [object.id]: object.defaultMessage,
  }),
  {},
);

const mergedTranslations = Object.assign({}, webappTranslations, normalizedAuthTranslations);

fs.outputJson('resource/translation/en-US.json', mergedTranslations, {spaces: 2}).catch(err => console.error(err));
