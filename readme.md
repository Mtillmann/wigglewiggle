# 🎶my viewport don't wiggle wiggle, it snaps🎵

This small script prevents people from resizing the browser windows as a means of testing responsive web design. I wrote
a similar script some 10 years ago and recently remembered it when the topic came up.

## Why?

Sometimes features like background visuals or viewport-size related DOM juggling will only be run or initialized once on
document load. When the viewport is resized without reloading the document, those feature can have a state that's not
representative of what a correct document initialization would look like.

Sometimes it's _very hard_ to communicate that fact properly, so I created this script which can remind people of
refreshing after resizing the browser window OR simulate different errors to nudge the user to stop doing it altogether.

Furthermore, optimizing CSS for arbitrary, random viewport dimensions (
fx. `@media screen and (orientation: landscape) and (min-width:790px) and (max-width:966px)`) is a huge waste of time
that introduces more problems down the line.

Likewise, writing javascript that only handles features during angry viewport scaling while visually inspecting a layout
is also extremely wasteful.

## How to do it better?

If you have no viewport-dependent features you can of course simply resize the window, although you'll hardly hit the
exact breakpoints. If you have features that depend on the viewport dimensions, reload the document after resizing the
browser window.

Even better, open the browser's dev-tools and use "toggle device toolbar" and it's features.

## How to use

1. Include the script in your document or bundle.
2. run `new Wigglewiggle(/* options = {} */)` in your code inside a `DOMContentLoaded` or `load` event

## Options

| key                 | type                                   | default                                                   | description                                                       |
|---------------------|----------------------------------------|-----------------------------------------------------------|-------------------------------------------------------------------|
| initImmediately     | bool                                   | true                                                      | when set to false, you have to call init on the instance manually |
| triggerOnInit       | bool                                   | false                                                     | when set to true, the effect will trigger on init                 |
| triggerThreshold    | number                                 | 10                                                        | how many resize events during 1000ms should tigger                |
| actions             | string[], function[], string, function | ['glitch']                                                | list of actions to perform on trigger                             | 
| alertMessage        | string | 'Please use your browser devtool\'s toggle device toolbar' | string for the alert action                                       |
| dropCSSNodeSelector | string | `link[rel="stylesheet"]:not([data-no-drop]), style:not([data-no-drop])`                                                          | style and link nodes to drop when using dropCSS action            |
| x                   | bool | true | watch horizontal (x-axis) resizing                                |
| y                   | bool | true | watch vertical (y-axis) resizing                                  |

## actions

Pass any number of actions or pass your own functions. If you pass a function it receives the instances as first and only argument. 

### viteError
Renders a fake vite hmr error box with some dumb stack trace and a subtle hint to stop resizing the window

### glitch
breaks the current view and disables input

### alert
creates a classic browser alert with message from `options.alertMessage`

### reload
simply reloads the page

### dropCSS
drops all css from the document