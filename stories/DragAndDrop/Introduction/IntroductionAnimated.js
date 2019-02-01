import React from 'react';

import Markdown from 'wix-storybook-utils/Markdown';

import Introduction from './Introduction.md';
import FAQ from './FAQ.md';
import Roadmap from './Roadmap.md';
import IntroductionAnimatedExample from './IntroductionAnimatedExample';
import { linkTo } from '@storybook/addon-links';
import TextLink from 'wix-style-react/TextLink';

export default () => (
  <div>
    <Markdown source={Introduction} />
    <IntroductionAnimatedExample />
    <TextLink onClick={linkTo('WIP/Drag And Drop/SortableList', 'API')}>
      {`<SortableList/>`} Docs
    </TextLink>
    <Markdown source={FAQ} />
    <Markdown source={Roadmap} />
  </div>
);
