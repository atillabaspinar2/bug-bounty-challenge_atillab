import { render, screen } from '@testing-library/react';
import UserStore from '../api/services/User/store';
import AvatarMenu from '../components/AvatarMenu';
import { TestWrapper } from '../testUtils';

// --- Bug 3a: UserStore typo (this.urser → this.user) ---

test('getOwnUser stores the result in user observable', async () => {
  jest.useFakeTimers();
  const store = new UserStore();
  expect(store.user).toBeNull();

  const promise = store.getOwnUser();
  jest.advanceTimersByTime(500);
  await promise;

  expect(store.user).not.toBeNull();
  expect(store.user?.firstName).toBe('Aria');
  expect(store.user?.lastName).toBe('Test');
  jest.useRealTimers();
});

// --- Bug 3b: getInitials guard for undefined firstName/lastName ---

test('AvatarMenu renders correct initials for full name', () => {
  render(
    <AvatarMenu user={{ firstName: 'Aria', lastName: 'Test' }} />,
    { wrapper: TestWrapper },
  );
  expect(screen.getByText('AT')).toBeInTheDocument();
});

test('AvatarMenu renders without crash when lastName is missing', () => {
  render(<AvatarMenu user={{ firstName: 'Aria' }} />, { wrapper: TestWrapper });
  expect(screen.getByText('A')).toBeInTheDocument();
});

test('AvatarMenu renders without crash when firstName is missing', () => {
  render(<AvatarMenu user={{ lastName: 'Test' }} />, { wrapper: TestWrapper });
  expect(screen.getByText('T')).toBeInTheDocument();
});

test('AvatarMenu renders without crash when both name fields are missing', () => {
  expect(() =>
    render(<AvatarMenu user={{}} />, { wrapper: TestWrapper }),
  ).not.toThrow();
});
