import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIImageGallery from '../AIImageGallery';

jest.useFakeTimers();

describe('AIImageGallery', () => {
  test('renders AI images initially', () => {
    render(<AIImageGallery />);
    
    expect(screen.getByText('AI Image Gallery')).toBeInTheDocument();
    expect(screen.getByAltText('AI Brain')).toBeInTheDocument();
    expect(screen.getByAltText('AI Network')).toBeInTheDocument();
    expect(screen.getByAltText('AI Data')).toBeInTheDocument();
  });

  test('hides images after 10 seconds', () => {
    render(<AIImageGallery />);
    
    // Images should be visible initially
    expect(screen.getByText('AI Image Gallery')).toBeInTheDocument();
    
    // Fast-forward time by 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Images should be hidden now
    expect(screen.queryByText('AI Image Gallery')).not.toBeInTheDocument();
  });
});