import React from 'react';
import {
  waitForVisibilityOf,
  scrollToElement,
} from 'wix-ui-test-utils/protractor';
import {
  createStoryUrl,
  createTestStoryUrl,
} from '../../test/utils/storybook-helpers';
import autoExampleDriver from 'wix-storybook-utils/AutoExampleDriver';
import { eyesItInstance } from '../../test/utils/eyes-it';
import { floatingNotificationTestkitFactory } from '../../testkit/protractor';
import { storySettings } from '../../stories/FloatingNotification/storySettings';
import { NOTIFICATION_TYPES } from './constants.js';

const eyes = eyesItInstance();

const someLongText = 'all work and no play makes jack a dull boy '.repeat(3);

describe('FloatingNotification', () => {
  [false, true].forEach(isRtl => {
    describe('AutoStory Page', () => {
      const storyUrl = createStoryUrl({
        kind: storySettings.category,
        story: storySettings.storyName,
        rtl: isRtl,
      });

      const createDriver = async (dataHook = storySettings.dataHook) => {
        const driver = floatingNotificationTestkitFactory({ dataHook });

        await waitForVisibilityOf(
          await driver.element(),
          `Cannot find <FloatingNotification/> component with dataHook of ${dataHook}`,
        );

        await scrollToElement(await driver.element());

        return driver;
      };

      beforeAll(async () => {
        await browser.get(storyUrl);
      });

      eyes.it('should render basic element', async () => {
        await createDriver();
      });

      Object.values(NOTIFICATION_TYPES).forEach(type => {
        eyes.it(`should render with type: ${type}`, async () => {
          await autoExampleDriver.setProps({ type });
          await createDriver();
        });
      });

      eyes.it('should render with textButton', async () => {
        await autoExampleDriver.setProps({
          type: NOTIFICATION_TYPES.STANDARD,
          showTextButton: true,
          textButtonProps: { label: 'Trash' },
        });
        await createDriver();
      });

      eyes.it('should render with button', async () => {
        await autoExampleDriver.setProps({
          showTextButton: false,
          showButton: true,
          buttonProps: { label: 'Undo' },
        });
        await createDriver();
      });

      eyes.it('should render with textButton and button', async () => {
        await autoExampleDriver.setProps({
          showTextButton: true,
          textButtonProps: { label: 'Trash' },
          showButton: true,
          buttonProps: { label: 'Undo' },
        });
        await createDriver();
      });

      eyes.it('should render with long text', async () => {
        await autoExampleDriver.setProps({
          showTextButton: false,
          showButton: false,
          text: someLongText,
        });
        await createDriver();
      });

      eyes.it('should render with long text and buttons', async () => {
        await autoExampleDriver.setProps({
          showTextButton: true,
          showButton: true,
          text: someLongText,
        });
        await createDriver();
      });

      eyes.it('should render with long text and no close button', async () => {
        await autoExampleDriver.setProps({
          showTextButton: false,
          showButton: false,
          showCloseButton: false,
          text: someLongText,
        });
        await createDriver();
      });
    });

    describe('Test Pages', () => {
      function testUrl(testName) {
        return createTestStoryUrl({
          category: storySettings.category,
          storyName: storySettings.storyName,
          testName,
          rtl: isRtl,
        });
      }

      eyes.it('should render with prefix icon', async () => {
        await browser.get(testUrl(storySettings.testStories.PREFIX_ICON));
      });
    });
  });
});
