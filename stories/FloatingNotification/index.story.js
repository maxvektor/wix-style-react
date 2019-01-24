import React from 'react';
import { storySettings } from './storySettings';
import LiveCodeExample from '../utils/Components/LiveCodeExample';

import StatusComplete from '../../new-icons/StatusComplete';

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
    icon: <StatusComplete size={24} />,
  },

  exampleProps: {
    // Put here presets of props, for more info:
    // https://github.com/wix/wix-ui/blob/master/packages/wix-storybook-utils/docs/usage.md#using-list
    type: Object.values(NOTIFICATION_TYPES),
  },

  examples: (
    <div style={{ maxWidth: 627 }}>
      <LiveCodeExample
        compact
        title="Live code example"
        initialCode={`
<FloatingNotification
  dataHook="story-floating-notification-live-example"
  type="standard"
  text="this is some text"
  />
        `}
      />
    </div>
  ),
};
