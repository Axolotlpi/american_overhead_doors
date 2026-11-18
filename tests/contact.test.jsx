// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Footer from '../src/footer';

afterEach(cleanup);

test('CMS contact details render as usable phone and email links', () => {
  render(<Footer contactData={{ phone: '+1 (210) 555-0123', email: 'office@example.com' }} />);
  expect(screen.getByRole('link', { name: '+1 (210) 555-0123' }).getAttribute('href')).toBe('tel:+12105550123');
  expect(screen.getByRole('link', { name: 'office@example.com' }).getAttribute('href')).toBe('mailto:office@example.com');
});

test('unpublished or blank contact details do not show fake contacts or empty links', () => {
  const { container, rerender } = render(<Footer />);
  expect(container.textContent).not.toContain('000');
  expect(container.textContent).not.toContain('example@email.com');
  rerender(<Footer contactData={{ phone: '   ', email: ' ' }} />);
  expect(container.querySelector('a[href^="tel:"], a[href^="mailto:"]')).toBeNull();
});
