import React from 'react';
import { storySettings } from './storySettings';
import StatusComplete from '../../new-icons/StatusComplete';
import FloatingNotificationExample from './examples';
import icons from '../utils/icons-for-story';

import FloatingNotification, {
  NOTIFICATION_TYPES,
} from '../../src/FloatingNotification';

export default {
  category: storySettings.kind,
  storyName: storySettings.storyName,

  component: FloatingNotification,
  componentPath: '../../src/FloatingNotification/FloatingNotification.js',

  componentProps: {
    dataHook: storySettings.dataHook,
    type: NOTIFICATION_TYPES.STANDARD,
    text: 'some content text',
    onClose: () => {},
    textButtonText: 'Trash',
    buttonText: 'Undo',
    prefixIcon: <StatusComplete />
  },

  exampleProps: {
    // Put here presets of props, for more info:
    // https://github.com/wix/wix-ui/blob/master/packages/wix-storybook-utils/docs/usage.md#using-list
    prefixIcon: icons,
    type: Object.values(NOTIFICATION_TYPES),
  },

  examples: <FloatingNotificationExample />,
};
