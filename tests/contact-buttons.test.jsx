// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Navbar from '../src/navbar';
import App from '../src/App';
import { client } from '../src/sanityClient';

const originalWidth = window.innerWidth;
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.innerWidth = originalWidth;
});

test.each([1280, 390])('Contact calls the CMS phone at viewport width %i', (width) => {
  window.innerWidth = width;
  render(<Navbar contactData={{ phone: ' +1 (210) 633-0533 ' }} />);
  if (width < 1024) fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
  expect(screen.getByRole('link', { name: 'Contact' }).getAttribute('href')).toBe('tel:+12106330533');
});

test('Contact retains the footer fallback when the CMS phone is absent', () => {
  window.innerWidth = 1280;
  const { rerender } = render(<Navbar />);
  expect(screen.getByRole('link', { name: 'Contact' }).getAttribute('href')).toBe('#contact');
  rerender(<Navbar contactData={{ phone: '   ' }} />);
  expect(screen.getByRole('link', { name: 'Contact' }).getAttribute('href')).toBe('#contact');
});

test('App supplies the fetched CMS phone to the Contact button', async () => {
  window.innerWidth = 1280;
  vi.spyOn(client, 'fetch').mockImplementation(async (query) =>
    query.includes('contactDetails') ? { phone: '(210) 633-0533' } : null,
  );
  render(<App />);
  await screen.findByRole('link', { name: '(210) 633-0533' });
  expect(screen.getByRole('link', { name: 'Contact' }).getAttribute('href')).toBe('tel:2106330533');
});
