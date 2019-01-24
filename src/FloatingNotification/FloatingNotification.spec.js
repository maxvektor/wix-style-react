import React from 'react';
import { createUniDriverFactory } from 'wix-ui-test-utils/uni-driver-factory';

import FloatingNotification from './FloatingNotification';
import { floatingNotificationPrivateDriverFactory } from './FloatingNotification.driver.private';

describe('FloatingNotification', () => {
  const createDriver = createUniDriverFactory(
    floatingNotificationPrivateDriverFactory,
  );

  it('should render', async () => {
    const driver = createDriver(<FloatingNotification />);

    expect(await driver.exists()).toBeTruthy();
    expect(await driver.getButtonText()).toEqual('Click me!');
  });

  it('should increment', async () => {
    const driver = createDriver(<FloatingNotification />);

    await driver.clickButton();
    await driver.clickButton();

    expect(await driver.getCountText()).toEqual(
      'You clicked this button 2 times',
    );
  });

  it('should allow changing the button text', async () => {
    const driver = createDriver(<FloatingNotification buttonText="Press me" />);

    expect(await driver.getButtonText()).toEqual('Press me');
  });
});
