import React from 'react';
import sinon from 'sinon';
import { createUniDriverFactory } from 'wix-ui-test-utils/uni-driver-factory';

import FloatingNotification, {
  NOTIFICATION_TYPES,
} from './FloatingNotification';
import { floatingNotificationPrivateDriverFactory } from './FloatingNotification.driver.private';
import { StatusComplete } from 'wix-ui-icons-common/dist/src';

describe('FloatingNotification', () => {
  const someText = 'someText';
  const someButtonLabel = 'someButtonLabel';
  const someButtonDataHook = 'someButtonDataHook';
  const someButtonOnClick = sinon.spy();

  const createDriver = props =>
    createUniDriverFactory(floatingNotificationPrivateDriverFactory)(
      <FloatingNotification {...props} />,
    );

  afterEach(() => {
    someButtonOnClick.reset();
  });

  Object.values(NOTIFICATION_TYPES).forEach(type => {
    it(`should render with correct types: type ${type}`, async () => {
      const driver = createDriver({
        type,
      });

      expect(await driver.getType()).toEqual(type);
    });
  });

  it('should render text', async () => {
    const driver = createDriver({
      text: someText,
    });

    expect(await driver.getText()).toEqual(someText);
  });

  it('should allow rendering button', async () => {
    const driver = createDriver({
      showButton: true,
      buttonProps: {
        label: someButtonLabel,
        dataHook: someButtonDataHook,
        onClick: someButtonOnClick,
      },
    });

    expect(await driver.getButtonText(someButtonDataHook)).toEqual(
      someButtonLabel,
    );
    await driver.clickButton(someButtonDataHook);
    expect(someButtonOnClick.calledOnce).toBeTruthy;
  });

  it('should allow rendering text button', async () => {
    const driver = createDriver({
      showTextButton: true,
      textButtonProps: {
        label: someButtonLabel,
        dataHook: someButtonDataHook,
        onClick: someButtonOnClick,
      },
    });

    expect(await driver.getTextButtonText(someButtonDataHook)).toEqual(
      someButtonLabel,
    );
    await driver.clickTextButton(someButtonDataHook);
    expect(someButtonOnClick.calledOnce).toBeTruthy;
  });

  it('should allow rendering prefix icon', async () => {
    const driver = createDriver({
      prefixIcon: <StatusComplete />,
    });

    expect((await driver.getPrefixIcon()).exists()).toBeTruthy();
  });
});
