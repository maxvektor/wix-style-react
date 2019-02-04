import React from 'react';
import LiveCodeExample from '../../utils/Components/LiveCodeExample';
import { Layout, Cell } from '../../../src/Layout';

import ExampleNoClose from '!raw-loader!./ExampleNoClose';
import ExampleAllTypes from '!raw-loader!./ExampleAllTypes';
import ExampleWithTextButton from '!raw-loader!./ExampleWithTextButton';
import ExampleWithButton from '!raw-loader!./ExampleWithButton';
import ExampleWithLongTextAndEverything from '!raw-loader!./ExampleWithLongTextAndEverything';
import ExampleWithLongText from '!raw-loader!./ExampleWithLongText';
import ExampleWithLongTextNoClose from '!raw-loader!./ExampleWithLongTextNoClose';
import ExampleWithButtons from '!raw-loader!./ExampleWithButtons';
import ExampleWithEverything from '!raw-loader!./ExampleWithEverything';

export default class FloatingNotificationExample extends React.Component {
  state = {
    examples: [
      { example: ExampleAllTypes, title: 'All types' },
      { example: ExampleNoClose, title: 'Only text' },
      { example: ExampleWithTextButton, title: 'With TextButton' },
      { example: ExampleWithButton, title: 'With Button' },
      { example: ExampleWithButtons, title: 'With TextButton and Button' },
      {
        example: ExampleWithEverything,
        title: 'With Icon, TextButton and Button',
      },
      { example: ExampleWithLongText, title: 'Long text' },
      { example: ExampleWithLongTextNoClose, title: 'Long text, no close button' },
      { example: ExampleWithLongTextAndEverything, title: 'Long text with buttons and icon' },
    ],
  };

  render() {
    const { examples } = this.state;

    return (
      <Layout>
        {examples.map(({ example, title }) => (
          <Cell span={12} key={title}>
            <LiveCodeExample compact title={title} initialCode={example} />
          </Cell>
        ))}
      </Layout>
    );
  }
}
