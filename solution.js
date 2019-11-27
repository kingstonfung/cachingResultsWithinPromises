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
const EXAMPLE_SUM = 2100;

const getResources = (lookupCode) => new Promise((resolve, reject) => {
  if (!MOCK_RESOURCE[lookupCode]) return reject({ message: 'Entry not found!' });

  if (!memorizedList[lookupCode]) {
    setTimeout(() => {
      console.log('Hitting backend services to look up resources...');
      const value = MOCK_RESOURCE[lookupCode];
      resolve(value);
      memorizedList[lookupCode] = value;
    }, 250);
  } else {
    console.log('Getting value from memorizedList (aka cached list)...');
    resolve(memorizedList[lookupCode]);
  }
});

const performWork = async () => {
  const lookups = ['a', 'aa', 'ff', 'a', 'a', 'b', 'b', 'c', 'c', 'a', 'zz', 'c', 'd', 'b'];
  let sumOfAllResults = 0;

  const reducer = (returningPromise, lookupValue) => {
    return returningPromise
      .then((resolvedValue) => {
        console.log('Received value from service, continuing on to the next lookup', resolvedValue);
        sumOfAllResults += resolvedValue || 0;
        return getResources(lookupValue);
      })
      .catch((error) => {
        console.log('Error occured. Report incidient and continuing...', error.message);
        return Promise.resolve();
      });
  };

  await lookups.reduce(reducer, Promise.resolve());
  return sumOfAllResults; // Sending the total sum back to the consumer...
};

(async () => {
  const sum = await performWork();
  if (sum !== EXAMPLE_SUM) throw new Error(`Result is not ${EXAMPLE_SUM}! Received ${sum} instead`);
  else console.log(`Total sum of ${EXAMPLE_SUM} received correctly.`)
})();
