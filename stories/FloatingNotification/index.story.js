import React from 'react';
import { storySettings } from './storySettings';
import icons from '../utils/icons-for-story';
import {
  tab,
  api,
  testkit,
  liveCode as baseLiveCode,
  description,
  importExample,
} from 'wix-storybook-utils/Sections';

import { baseScope } from '../utils/Components/LiveCodeExample';
import FloatingNotification from '../../src/FloatingNotification';
import { NOTIFICATION_TYPES } from '../../src/FloatingNotification/constants';
import examples from './examples';

const baseProps = {
  autoRender: false,
};

const liveCode = config =>
  baseLiveCode({ components: { ...baseScope }, ...baseProps, ...config });

const trashLabel = { label: 'Trash' };
const linkProps = {
  as: 'a',
  href: 'https://www.wix.com',
  label: 'Wix.com',
};
const textButtonPropsExamples = [
  { label: JSON.stringify(trashLabel), value: trashLabel },
  { label: JSON.stringify(linkProps), value: linkProps },
];

const undoLabel = { label: 'Undo' };
const buttonPropsExamples = [
  { label: JSON.stringify(undoLabel), value: undoLabel },
  { label: JSON.stringify(linkProps), value: linkProps },
];

export default {
  category: storySettings.kind,
  storyName: storySettings.storyName,

  component: FloatingNotification,
  componentPath: '../../src/FloatingNotification/FloatingNotification.js',

  componentProps: {
    dataHook: storySettings.dataHook,
    type: NOTIFICATION_TYPES.STANDARD,
    text: 'some content text',
    showCloseButton: true,
    showTextButton: false,
    textButtonProps: textButtonPropsExamples[0].value,
    showButton: false,
    buttonProps: buttonPropsExamples[0].value,
    prefixIcon: null,
  },

  exampleProps: {
    prefixIcon: icons,
    type: Object.values(NOTIFICATION_TYPES),
    textButtonProps: textButtonPropsExamples,
    buttonProps: buttonPropsExamples,
  },

  sections: [
    tab({
      title: 'Description',
      sections: [
        description({
          text: 'Displays simple and temporary messages or destructive events',
        }),

        importExample({
          source:
            "import FloatingNotification from 'wix-style-react/FloatingNotification';",
        }),

        description({
          title: `Notification types`,
        }),

        liveCode({
          source: examples.ExampleAllTypes,
        }),

        description({
          title: `All options`,
        }),

        liveCode({
          source: examples.ExampleAllOptions,
        }),

        description({
          title: `Set buttons as anchors with href`,
        }),

        liveCode({
          source: examples.ExampleHref,
        }),
      ],
    }),

    tab({
      title: 'API',
      sections: [api()],
    }),

    tab({
      title: 'Testkit',
      sections: [testkit()],
    }),
  ],
};
