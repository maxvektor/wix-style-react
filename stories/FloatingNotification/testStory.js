import React from 'react';
import { storiesOf } from '@storybook/react';
import { getTestStoryKind } from '../storiesHierarchy';
import FloatingNotification from '../../src/FloatingNotification';
import { storySettings } from './storySettings';
import { StatusComplete } from '../../new-icons';

const kind = getTestStoryKind({
  category: storySettings.category,
  storyName: storySettings.storyName,
});

storiesOf(kind, module).add(storySettings.testStories.PREFIX_ICON, () => {
  return (
    <FloatingNotification text="some text" prefixIcon={<StatusComplete />} />
  );
});
