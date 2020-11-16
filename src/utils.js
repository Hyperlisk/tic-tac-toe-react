
function makeOneOf(Math) {
  return function oneOf(list) {
    return list[Math.floor(Math.random() * list.length)];
  };
}

export const oneOf = makeOneOf(Math);
