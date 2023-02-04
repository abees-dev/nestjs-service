const color = {
  main: {
    name: 'string',
  },
};

console.log('main.name'.split('.'));

const nameArray = ['main', 'name'];

console.log(color[nameArray[0]][nameArray[1]]);
