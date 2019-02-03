import { floatingNotificationDriverFactory as publicDriverFactory } from './FloatingNotification.driver';
import { NOTIFICATION_TYPES } from './FloatingNotification';

export const floatingNotificationPrivateDriverFactory = base => {
  return {
    ...publicDriverFactory(base),

    // Add here driver methods that considered "private"
    /** Get type of notification */
    getType: async () => {
      const classList = await base.attr('class');
      return classList.replace(/root|\s+/g, '') || NOTIFICATION_TYPES.STANDARD;
    },
  };
};
