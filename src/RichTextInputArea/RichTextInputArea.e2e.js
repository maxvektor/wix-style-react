import {
  createStoryUrl,
  waitForVisibilityOf,
  scrollToElement,
} from 'wix-ui-test-utils/protractor';

import { eyesItInstance } from '../../test/utils/eyes-it';
import { richTextInputAreaTestkitFactory } from '../../testkit/protractor';
import { storySettings } from '../../stories/RichTextInputArea/storySettings';

const eyes = eyesItInstance();

describe('RichTextInputArea', () => {
  const storyUrl = createStoryUrl({
    kind: storySettings.category,
    story: storySettings.storyName,
  });

  const createDriver = async (dataHook = storySettings.dataHook) => {
    const driver = richTextInputAreaTestkitFactory({ dataHook });

    await waitForVisibilityOf(
      await driver.element(),
      `Cannot find <RichTextInputArea/> component with dataHook of ${dataHook}`,
    );

    await scrollToElement(await driver.element());

    return driver;
  };

  beforeAll(async () => {
    await browser.get(storyUrl);
  });

  eyes.it('should render', async () => {
    await createDriver();
  });

  eyes.it('should render live example', async () => {
    await createDriver('story-rich-text-input-area-live-example');
  });
});
