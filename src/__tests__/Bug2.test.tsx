import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';
import { TestWrapper } from '../testUtils';

test('intro text renders "known" inside a <strong> element', () => {
  const { container } = render(<Home />, { wrapper: TestWrapper });
  const strong = container.querySelector('strong');
  expect(strong).toBeInTheDocument();
  expect(strong).toHaveTextContent('known');
});

test('intro text does not render raw HTML tags as literal text', () => {
  render(<Home />, { wrapper: TestWrapper });
  expect(screen.queryByText(/<b>known<\/b>/)).not.toBeInTheDocument();
});
