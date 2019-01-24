import { baseUniDriverFactory } from 'wix-ui-test-utils/base-driver';

export const floatingNotificationDriverFactory = base => {
  return {
    ...baseUniDriverFactory(base),

    /** Get the current count */
    getCountText: async () => base.$('[data-hook="floatingNotification-count"]').text(),

    /** Click the button */
    clickButton: async () => base.$('[data-hook="floatingNotification-button"]').click(),

    /** Get the button's text */
    getButtonText: async () => base.$('[data-hook="floatingNotification-button"]').text(),
  };
};
