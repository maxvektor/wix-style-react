import { baseUniDriverFactory } from 'wix-ui-test-utils/base-driver';
import ReactTestUtils from 'react-dom/test-utils';

export const richTextInputAreaDriverFactory = base => {
  const getTextArea = () => base.$('.public-DraftEditor-content');

  return {
    ...baseUniDriverFactory(base),
    getContent: () => base.text(),
    hoverTextArea: async () => await getTextArea().hover(),
    clickTextArea: async () => await getTextArea().click(),
    enterText: async text => {
      if (base.type === 'react') {
        const textAreaNative = await getTextArea().getNative();
        ReactTestUtils.Simulate.beforeInput(textAreaNative, { data: text });
      }
    },
  };
};
