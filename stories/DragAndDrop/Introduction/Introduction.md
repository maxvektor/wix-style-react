# Drag and Drop Introduction
## Drag and Drop in wix-style-react
`wix-style-react` aims to provide following solutions:
1. ADD the Drag and Drop functionality to existing components (Tags for example)
2. Reusable D&D components and common stylesheets.

### How does it work
Behind the scenes, `wix-style-react` uses [`react-dnd`](http://react-dnd.github.io/react-dnd/), a set of React higher-order components to help you build complex drag and drop interfaces. As `react-dnd` has a complex API, `wix-style-react` provides simple building blocks to solve common use case.

### Usage
The most useful building block you should be aware of is the `<SortableList/>` component. It has a very simple sorting capability and is up to the consumer to style it according to different requirements.

### Example
Here is a simple usage of the `<SortableList/>` component with basic styles (Give it a try)!

### Animations

#### Default animation effect
SortableList has default animation effect - visual items repositioning without changing component's state. This is just a view for future items positions.

Default animation effect could be overridden by using two props:
* `animationDuration` (0 by default, without animation) - value in ms
* `animationTiming` ('' by default) - timing function for an animation, could be any value which will be accepted by `animation-timing-function` at CSS

#### Custom animation effects
Currently there is no possibility to add custom animations.
