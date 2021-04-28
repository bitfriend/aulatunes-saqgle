import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

afterEach(cleanup);

it('switches tab', () => {
  const { getByText } = render(<App />);
  const topAlbumsTab = getByText('Top Albums');
  const topSongsTab = getByText('Top Songs');
  userEvent.click(topSongsTab);
  userEvent.click(topAlbumsTab);
});
