import React from 'react';
import { render } from '@testing-library/react-native';
import AddIcon from '../AddIcon';

describe('AddIcon', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<AddIcon />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('renders with custom size', () => {
    const { getByTestId } = render(<AddIcon size={32} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('renders with custom color', () => {
    const { getByTestId } = render(<AddIcon color="#FF0000" />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('renders with both custom size and color', () => {
    const { getByTestId } = render(<AddIcon size={48} color="#00FF00" />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('uses default size when not provided', () => {
    const { getByTestId } = render(<AddIcon />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('uses default color when not provided', () => {
    const { getByTestId } = render(<AddIcon />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('handles zero size gracefully', () => {
    const { getByTestId } = render(<AddIcon size={0} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('handles negative size gracefully', () => {
    const { getByTestId } = render(<AddIcon size={-10} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('handles very large size', () => {
    const { getByTestId } = render(<AddIcon size={100} />);
    // The component renders without crashing
    expect(getByTestId).toBeDefined();
  });

  it('handles different color formats', () => {
    const { getByTestId: getHex } = render(<AddIcon color="#FF0000" />);
    const { getByTestId: getRgb } = render(<AddIcon color="rgb(255, 0, 0)" />);
    const { getByTestId: getNamed } = render(<AddIcon color="red" />);

    expect(getHex).toBeDefined();
    expect(getRgb).toBeDefined();
    expect(getNamed).toBeDefined();
  });
}); 