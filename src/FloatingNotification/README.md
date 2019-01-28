# `<FloatingNotification/>`

> Displays simple and temporary messages or destructive events

## Props
* `type` - On of ['destructive', 'standard', 'success', 'warning', 'premium']

* `onClose` - A function that is called when clicking on the X button. <mark>**The X button appears only if this prop 
exists (maybe you would like me to add an `enableClose` prop?)**</mark>
* `text` - A string, which will be the `FloatingNotification`'s content (the message itself) - <mark>Do we want it 
to be the `children` prop instead? Or maybe a `Node` or `Element` instead of a `string`?</mark>.
* `linkButtonText` - The text to show in the `TextButton` element. <mark>**The `TextButton` element appears only if this 
prop exists (maybe you would like me to add an `enableTextButton` prop?)**</mark>  
<mark>Another thing, I called it `linkButtonText` because `textButtonText` was a bit weird, but I believe I should change 
it</mark>.
* `onLinkButtonClick` - The function to be called when the `TextButton` is clicked
* `buttonText` - The text to show in the `Button` element. <mark>**The `Button` element appears only if this prop exists
 (maybe you would like me to add an`enableButton` prop?)**</mark>
 * `onButtonClick` - The function to be called when the `Button` is clicked
 * `prefixIcon` - The prefix icon to be placed. Receives an `Element` type.
 * `floatable` - This is a boolean which enables the stacking mechanism. When this is unset or false, the notification 
 is positioned relative to the flow and always visible. When this is true, the notification will appear and disappear 
 in the top of the parent element. 
 * `show` - This is a boolean that shows and hides the notification when in "floating mode"
 
 ## Some comments & questions regarding the floating mechanism:
 I wrote this assuming that we don't know anything about the parent; If it's relatively positioned or absolute, or 
 whatever.      
 
 Do we want to assume otherwise?
    
 Because in order to position the notification I calculate the position of the parent, and set the notification element's 
 position as its parent. This might be a bit of an overkill and even maybe a bit buggy, so I wasn't sure this is the 
 solution you guys were looking for. 
 
 Other solutions might be: 
 * Remove the `floatable` and `show` props, and let the user handle the floating mechanism
 * Use `absolute` positioning for the element, and assuming the user sets the parent to be positioned `relative` or 
 `absolute`.    