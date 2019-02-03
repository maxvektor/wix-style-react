import { baseUniDriverFactory } from 'wix-ui-test-utils/base-driver';

export const floatingNotificationDriverFactory = base => {
  return {
    ...baseUniDriverFactory(base),

    /** Click the button */
    clickButton: async dataHook => base.$(`[data-hook="${dataHook}"]`).click(),

    /** Get the button's text */
    getButtonText: async dataHook => base.$(`[data-hook="${dataHook}"]`).text(),

    /** Click the text button */
    clickTextButton: async dataHook =>
      base.$(`[data-hook="${dataHook}"]`).click(),

    /** Get the text button's text */
    getTextButtonText: async dataHook =>
      base.$(`[data-hook="${dataHook}"]`).text(),

    /** Click the button */
    clickCloseButton: async dataHook =>
      base.$(`[data-hook="${dataHook}"]`).click(),

    /** get prefix icon */
    getPrefixIcon: async () => base.$('.icon > svg'),

    /** get notification text */
    getText: async () =>
      base.$('[data-hook="FloatingNotification-text"]').text(),
  };
};
