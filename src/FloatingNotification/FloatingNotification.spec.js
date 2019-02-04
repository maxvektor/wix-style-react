import React from 'react';
import { createRendererWithUniDriver, cleanup } from '../../test/utils/unit';

import FloatingNotification from './FloatingNotification';
import { floatingNotificationPrivateDriverFactory } from './FloatingNotification.driver.private';

describe('FloatingNotification', () => {
  const someText = 'someText';
  const someButtonLabel = 'someButtonLabel';
  const someButtonOnClick = jest.fn();
  const render = createRendererWithUniDriver(
    floatingNotificationPrivateDriverFactory,
  );

  const createDriver = props =>
    render(<FloatingNotification {...props} />).driver;

  afterEach(() => {
    someButtonOnClick.mockRestore();
    cleanup();
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
        onClick: someButtonOnClick,
      },
    });

    expect(await driver.getButtonLabel()).toEqual(someButtonLabel);
    await driver.clickButton();
    expect(someButtonOnClick).toHaveBeenCalledTimes(1);
  });

  it('should allow rendering text button', async () => {
    const driver = createDriver({
      showTextButton: true,
      textButtonProps: {
        label: someButtonLabel,
        onClick: someButtonOnClick,
      },
    });

    expect(await driver.getTextButtonLabel()).toEqual(someButtonLabel);
    await driver.clickTextButton();
    expect(someButtonOnClick).toHaveBeenCalledTimes(1);
  });
});
