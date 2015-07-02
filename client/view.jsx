import dbg from 'debug';

var debug = dbg('app:view');

export default function View(model) {

  return model.model$
  .map(model => {
    return <div>{model.fuck}</div>;
  });
};
