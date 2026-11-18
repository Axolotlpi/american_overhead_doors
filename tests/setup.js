// React detects animation event support when react-dom is first imported.
// jsdom supports dispatching these events but does not expose this constructor.
window.AnimationEvent ??= window.Event;
