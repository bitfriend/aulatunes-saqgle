import { fetchData } from './api';

it('fetch topalbums from iTunes', () => {
  expect.assertions(1);
  return fetchData('topalbums').then(records => {
    expect(Array.isArray(records)).toEqual(true);
  }).catch(err => {
    expect(typeof err).toEqual(true);
  });
});

it('fetch topsongs from iTunes', () => {
  expect.assertions(1);
  return fetchData('topsongs').then(records => {
    expect(Array.isArray(records)).toEqual(true);
  }).catch(err => {
    expect(typeof err).toEqual(true);
  });
});
