/*
Let's say this is a lambda function, that receives a list of lookup codes from the front end.

Wtih this list, I am required to perform a lookup asynchronously using those lookup codes. And then
once the values are aggregated, we need to return a computed value using every entry, back to
the consumer.

====================

Question:
How to utilize `memorizedList` to store (cache) values that are retrieved already, to minimize
the number of requests & hits made to the backend?
*/

const MOCK_RESOURCE = { a: 100, b: 200, c: 300, d: 400 };
const memorizedList = {};

const getResources = (lookupCode) => new Promise((resolve, reject) => {
  if (!memorizedList[lookupCode]) {
    setTimeout(() => {
      console.log('Hitting backend services to look up resources...');
      const value = MOCK_RESOURCE[lookupCode];
      resolve(value);
      memorizedList[lookupCode] = value;
    }, 10);
  } else {
    console.log('Getting value from memorizedList (aka cached list)...');
    resolve(memorizedList[lookupCode]);
  }
});

const lookupArrayItem = async (item) => {
  const result = await getResources(item);
  return result;
};

const performWork = async () => {
  const lookups = ['a', 'a', 'a', 'b', 'b', 'c', 'c', 'a', 'c', 'd', 'b'];
  const result = lookups.map(lookupArrayItem);

  const finalResult = await Promise.all(result);
  console.log('finalResult from performWork', finalResult);
  const sumOfAllResults = finalResult.reduce((a, b) => a + b, 0);
  console.log('sumOfAllResults', sumOfAllResults);
  return sumOfAllResults; // Sending the total sum back to the consumer...
};

performWork();
