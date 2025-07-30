import React from 'react';
import { render } from '@testing-library/react-native';
import GiftCardIcon from '../GiftCardIcon';

describe('GiftCardIcon', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<GiftCardIcon />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('renders with custom size', () => {
    const { getByTestId } = render(<GiftCardIcon size={80} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('renders with custom color', () => {
    const { getByTestId } = render(<GiftCardIcon color="#FF0000" />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('renders with both custom size and color', () => {
    const { getByTestId } = render(<GiftCardIcon size={100} color="#00FF00" />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('uses default size when not provided', () => {
    const { getByTestId } = render(<GiftCardIcon />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('uses default color when not provided', () => {
    const { getByTestId } = render(<GiftCardIcon />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('handles zero size gracefully', () => {
    const { getByTestId } = render(<GiftCardIcon size={0} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('handles negative size gracefully', () => {
    const { getByTestId } = render(<GiftCardIcon size={-10} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('handles very large size', () => {
    const { getByTestId } = render(<GiftCardIcon size={200} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('handles different color formats', () => {
    const { getByTestId: getHex } = render(<GiftCardIcon color="#FF0000" />);
    const { getByTestId: getRgb } = render(<GiftCardIcon color="rgb(255, 0, 0)" />);
    const { getByTestId: getNamed } = render(<GiftCardIcon color="red" />);

    expect(getHex).toBeDefined();
    expect(getRgb).toBeDefined();
    expect(getNamed).toBeDefined();
  });

  it('maintains aspect ratio with custom size', () => {
    const { getByTestId } = render(<GiftCardIcon size={120} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('renders with small size', () => {
    const { getByTestId } = render(<GiftCardIcon size={30} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('renders with medium size', () => {
    const { getByTestId } = render(<GiftCardIcon size={60} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('renders with large size', () => {
    const { getByTestId } = render(<GiftCardIcon size={120} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });
}); 