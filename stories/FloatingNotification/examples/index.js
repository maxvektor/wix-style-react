import React from 'react';
import LiveCodeExample from '../../utils/Components/LiveCodeExample';
import { Layout, Cell } from '../../../src/Layout';

import ExampleSimple from '!raw-loader!./ExampleSimple';
import ExampleWithLongText from '!raw-loader!./ExampleWithLongText';
import ExampleWithEverything from '!raw-loader!./ExampleWithEverything';

export default class FloatingNotificationExample extends React.Component {
  state = {
    examples: [
      { example: ExampleSimple, title: 'Only text' },
      { example: ExampleWithEverything, title: 'All options' },
      { example: ExampleWithLongText, title: 'Long text' },
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
