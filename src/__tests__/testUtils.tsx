import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { osapiens } from '../themes';
import '../i18n/i18n';

export const TestWrapper: React.FC = ({ children }) => (
  <ThemeProvider theme={osapiens.light}>{children}</ThemeProvider>
);
