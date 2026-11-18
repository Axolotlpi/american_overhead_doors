// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import Gallery from '../src/gallery';
import Reviews from '../src/reviews';
import Footer from '../src/footer';

afterEach(() => { cleanup(); vi.useRealTimers(); });
const pages = [{ images: [{ src: '/one.jpg', alt: 'One' }] }, { images: [{ src: '/two.jpg', alt: 'Two' }] }];
const reviews = Array.from({ length: 4 }, (_, i) => ({ text: `Review ${i}`, name: `Customer ${i}` }));

test('gallery completes next/back without animation events and resets after data shrinks', () => {
  vi.useFakeTimers();
  const { rerender } = render(<Gallery galleries={pages} />);
  fireEvent.click(screen.getByLabelText('Next page'));
  act(() => vi.advanceTimersByTime(2500));
  expect(screen.getByAltText('Two')).toBeTruthy();
  expect(screen.getByLabelText('Previous page').disabled).toBe(false);
  fireEvent.click(screen.getByLabelText('Previous page'));
  act(() => vi.advanceTimersByTime(2500));
  expect(screen.getByAltText('One')).toBeTruthy();
  fireEvent.click(screen.getByLabelText('Next page'));
  act(() => vi.advanceTimersByTime(2500));
  rerender(<Gallery galleries={[pages[0]]} />);
  expect(screen.getByAltText('One')).toBeTruthy();
});

test('gallery animation events support partial pages', () => {
  const { container } = render(<Gallery galleries={pages} />);
  fireEvent.click(screen.getByLabelText('Next page'));
  fireEvent.animationEnd(container.querySelector('.gallery-curtain-in'));
  expect(screen.getByAltText('Two')).toBeTruthy();
  fireEvent.animationEnd(container.querySelector('.gallery-curtain-out'));
  expect(screen.getByLabelText('Previous page').disabled).toBe(false);
});

test('empty gallery does not render a blank full-screen section', () => {
  const { container } = render(<Gallery galleries={[]} />);
  expect(container.querySelector('#gallery')).toBeNull();
});

test('desktop and mobile reviews unlock without animation events and reset on replacement', () => {
  vi.useFakeTimers();
  const { container, rerender } = render(<Reviews reviews={reviews} />);
  const desktop = container.querySelector('.reviews-desktop');
  const mobile = container.querySelector('.reviews-mobile');
  fireEvent.click(desktop.querySelector('[aria-label="Next review"]'));
  fireEvent.click(mobile.querySelector('[aria-label="Next review"]'));
  act(() => vi.advanceTimersByTime(1000));
  expect(desktop.querySelector('[aria-label="Previous review"]').disabled).toBe(false);
  expect(mobile.querySelector('[aria-label="Previous review"]').disabled).toBe(false);
  expect(desktop.querySelector('.review-slide-out-left')).toBeNull();
  expect(mobile.querySelector('.review-slide-out-left')).toBeNull();
  rerender(<Reviews reviews={[reviews[0]]} />);
  expect(desktop.textContent).toContain('Review 0');
  expect(mobile.textContent).toContain('Review 0');
});

test('empty reviews render nothing', () => {
  const { container } = render(<Reviews reviews={[]} />);
  expect(container.innerHTML).toBe('');
});

test('Contact navigation has a real footer destination', () => {
  const { container } = render(<Footer />);
  expect(container.querySelector('footer#contact')).not.toBeNull();
});
