const { Ray } = require('./index');

function ray(...args) {
    return (new Ray()).send(...args);
}

ray().html('<em>hello world</em>').color('red');

ray().send('hello world 2').color('blue');

ray().ban();
