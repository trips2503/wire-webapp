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

import {Button, ContainerXS, ErrorMessage, H1, Input} from '@wireapp/react-ui-kit';
import React, {useState} from 'react';
import useReactRouter from 'use-react-router';
import {ROUTE} from '../route';
import {parseError} from '../util/errorUtil';
import Page from './Page';

const CheckPassword = () => {
  //const {formatMessage: _} = useIntl();
  const [error /*, setError*/] = useState();

  const {history} = useReactRouter();

  const navigateNext = () => {
    history.push(ROUTE.HISTORY_INFO);
  };

  return (
    <Page>
      <ContainerXS
        centerText
        verticalCenter
        style={{display: 'flex', flexDirection: 'column', height: 428, justifyContent: 'space-between'}}
      >
        <div>
          <H1 center>{'Enter password'}</H1>
          <Input />
          <ErrorMessage data-uie-name="error-message">{parseError(error)}</ErrorMessage>
          <Button onClick={navigateNext}>{'Next'}</Button>
        </div>
      </ContainerXS>
    </Page>
  );
};

export default CheckPassword;