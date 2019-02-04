import { baseUniDriverFactory } from 'wix-ui-test-utils/base-driver';
import {
  BUTTON_DATA_HOOK,
  TEXT_BUTTON_DATA_HOOK,
  TEXT_DATA_HOOK,
  CLOSE_BUTTON_DATA_HOOK,
} from './FloatingNotification';

export const floatingNotificationDriverFactory = base => {
  return {
    ...baseUniDriverFactory(base),

    /** Click the button */
    clickButton: async () =>
      base.$(`[data-hook="${BUTTON_DATA_HOOK}"]`).click(),

    /** Get the button's text */
    getButtonLabel: async () =>
      base.$(`[data-hook="${BUTTON_DATA_HOOK}"]`).text(),

    /** Click the text button */
    clickTextButton: async () =>
      base.$(`[data-hook="${TEXT_BUTTON_DATA_HOOK}"]`).click(),

    /** Get the text button's text */
    getTextButtonLabel: async () =>
      base.$(`[data-hook="${TEXT_BUTTON_DATA_HOOK}"]`).text(),

    /** Click the button */
    clickCloseButton: async () =>
      base.$(`[data-hook="${CLOSE_BUTTON_DATA_HOOK}"]`).click(),

    /** get notification text */
    getText: async () => base.$(`[data-hook="${TEXT_DATA_HOOK}"]`).text(),
  };
};
