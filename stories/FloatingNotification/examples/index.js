import ExampleAllTypes from '!raw-loader!./ExampleAllTypes';
import ExampleAllOptions from '!raw-loader!./ExampleAllOptions';
import ExampleHref from '!raw-loader!./ExampleHref';

export default {
  ExampleAllTypes,
  ExampleAllOptions,
  ExampleHref,
};

// import React from 'react';
// import LiveCodeExample from '../../utils/Components/LiveCodeExample';
// import { Layout, Cell } from '../../../src/Layout';
//
//
// export default class FloatingNotificationExample extends React.Component {
//   state = {
//     examples: [
//       { example: ExampleAllTypes, title: 'All types' },
//       { example: ExampleAllOptions, title: 'All options' },
//       { example: ExampleHref, title: 'TextButton as anchor with href' },
//     ],
//   };
//
//   render() {
//     const { examples } = this.state;
//
//     return (
//       <Layout>
//         {examples.map(({ example, title }) => (
//           <Cell span={12} key={title}>
//             <LiveCodeExample compact title={title} initialCode={example} />
//           </Cell>
//         ))}
//       </Layout>
//     );
//   }
// }
