import { render, screen, act } from '@testing-library/react';
import AppHeader from '../components/AppHeader';
import { TestWrapper } from './testUtils';

const mockUser = { firstName: 'Aria', lastName: 'Test', eMail: 'a@b.com' };

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('countdown starts at 60:00', () => {
  render(<AppHeader user={mockUser} pageTitle="Test" />, { wrapper: TestWrapper });
  expect(screen.getByText('60:00')).toBeInTheDocument();
});

test('countdown decrements by 1 second each tick', async () => {
  render(<AppHeader user={mockUser} pageTitle="Test" />, { wrapper: TestWrapper });

  await act(async () => { jest.advanceTimersByTime(1000); });
  expect(screen.getByText('59:59')).toBeInTheDocument();

  await act(async () => { jest.advanceTimersByTime(59000); });
  expect(screen.getByText('59:00')).toBeInTheDocument();
});

test('interval is cleared on unmount', () => {
  const clearSpy = jest.spyOn(window, 'clearInterval');
  const { unmount } = render(
    <AppHeader user={mockUser} pageTitle="Test" />,
    { wrapper: TestWrapper },
  );
  unmount();
  expect(clearSpy).toHaveBeenCalled();
  clearSpy.mockRestore();
});

test('remounting starts a fresh countdown at 60:00', async () => {
  const { unmount } = render(
    <AppHeader user={mockUser} pageTitle="Test" />,
    { wrapper: TestWrapper },
  );
  await act(async () => { jest.advanceTimersByTime(5000); });
  unmount();

  render(<AppHeader user={mockUser} pageTitle="Test" />, { wrapper: TestWrapper });
  expect(screen.getByText('60:00')).toBeInTheDocument();
});
