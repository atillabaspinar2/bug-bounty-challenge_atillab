import { render, screen, fireEvent } from '@testing-library/react';
import AppHeader from '../components/AppHeader';
import { TestWrapper } from './testUtils';
import i18n from '../i18n/i18n';

const mockUser = { firstName: 'Aria', lastName: 'Test', eMail: 'a@b.com' };

beforeEach(() => i18n.changeLanguage('en'));

test('language switcher renders with current language label', () => {
  render(<AppHeader user={mockUser} pageTitle="Test" />, { wrapper: TestWrapper });
  expect(screen.getByText('Language (EN)')).toBeInTheDocument();
});

test('language switcher shows EN and DE options when opened', () => {
  const { container } = render(
    <AppHeader user={mockUser} pageTitle="Test" />,
    { wrapper: TestWrapper },
  );
  const trigger = container.querySelector('.MuiSelect-select')!;
  fireEvent.mouseDown(trigger);

  expect(screen.getByRole('option', { name: 'EN' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'DE' })).toBeInTheDocument();
});

test('selecting DE changes the active language', () => {
  const { container } = render(
    <AppHeader user={mockUser} pageTitle="Test" />,
    { wrapper: TestWrapper },
  );
  const trigger = container.querySelector('.MuiSelect-select')!;
  fireEvent.mouseDown(trigger);
  fireEvent.click(screen.getByRole('option', { name: 'DE' }));

  expect(i18n.language).toBe('de');
});

test('switching to DE updates translated text in the UI', () => {
  const { container } = render(
    <AppHeader user={mockUser} pageTitle="Test" />,
    { wrapper: TestWrapper },
  );
  const trigger = container.querySelector('.MuiSelect-select')!;
  fireEvent.mouseDown(trigger);
  fireEvent.click(screen.getByRole('option', { name: 'DE' }));

  expect(screen.getByText('Sprache (DE)')).toBeInTheDocument();
});
