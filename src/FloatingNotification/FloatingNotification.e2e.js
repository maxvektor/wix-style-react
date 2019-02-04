import {
  createStoryUrl,
  waitForVisibilityOf,
  scrollToElement,
} from 'wix-ui-test-utils/protractor';

import { eyesItInstance } from '../../test/utils/eyes-it';
import { floatingNotificationTestkitFactory } from '../../testkit/protractor';
import { storySettings } from '../../stories/FloatingNotification/storySettings';

const eyes = eyesItInstance();

describe('FloatingNotification', () => {// eslint-disable-line
  const storyUrl = createStoryUrl({
    kind: storySettings.category,
    story: storySettings.storyName,
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

  eyes.it('should render all examples', async () => {
    await createDriver();
  });
});
