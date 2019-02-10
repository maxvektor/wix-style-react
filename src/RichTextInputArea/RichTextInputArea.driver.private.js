import {
  richTextInputAreaDriverFactory as publicDriverFactory,
  getTextArea,
} from './RichTextInputArea.driver';

export const richTextInputAreaPrivateDriverFactory = base => {
  return {
    ...publicDriverFactory(base),
    hoverTextArea: async () => await getTextArea(base).hover(),
    clickTextArea: async () => await getTextArea(base).click(),
  };
};
