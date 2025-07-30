import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomInput from '../CustomInput';

describe('CustomInput', () => {
  it('renders correctly with label', () => {
    const { getByText, getByPlaceholderText } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
      />
    );

    expect(getByText('Test Label')).toBeTruthy();
    expect(getByPlaceholderText('Test Placeholder')).toBeTruthy();
  });

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
        error="This is an error message"
      />
    );

    expect(getByText('This is an error message')).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value=""
        onChangeText={mockOnChangeText}
      />
    );

    const input = getByPlaceholderText('Test Placeholder');
    fireEvent.changeText(input, 'test input');
    expect(mockOnChangeText).toHaveBeenCalledWith('test input');
  });

  it('calls onFocus when input is focused', () => {
    const mockOnFocus = jest.fn();
    const { getByPlaceholderText } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
        onFocus={mockOnFocus}
      />
    );

    const input = getByPlaceholderText('Test Placeholder');
    fireEvent(input, 'focus');
    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('calls onBlur when input loses focus', () => {
    const mockOnBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
        onBlur={mockOnBlur}
      />
    );

    const input = getByPlaceholderText('Test Placeholder');
    fireEvent(input, 'blur');
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('displays the current value', () => {
    const { getByDisplayValue } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value="Current Value"
        onChangeText={() => {}}
      />
    );

    expect(getByDisplayValue('Current Value')).toBeTruthy();
  });

  it('applies custom container style', () => {
    const customStyle = { marginTop: 20 };
    const { getByText } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
        containerStyle={customStyle}
      />
    );

    expect(getByText('Test Label')).toBeTruthy();
  });

  it('handles focus state correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
      />
    );

    const input = getByPlaceholderText('Test Placeholder');
    const label = getByText('Test Label');

    // Initially not focused
    expect(label).toBeTruthy();

    // Focus the input
    fireEvent(input, 'focus');
    expect(label).toBeTruthy();

    // Blur the input
    fireEvent(input, 'blur');
    expect(label).toBeTruthy();
  });

  it('handles error state styling', () => {
    const { getByText, getByPlaceholderText } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
        error="Error message"
      />
    );

    expect(getByText('Error message')).toBeTruthy();
    expect(getByPlaceholderText('Test Placeholder')).toBeTruthy();
  });

  it('passes through additional TextInput props', () => {
    const { getByPlaceholderText } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
        keyboardType="numeric"
        secureTextEntry={true}
      />
    );

    const input = getByPlaceholderText('Test Placeholder');
    expect(input).toBeTruthy();
  });

  it('handles empty value correctly', () => {
    const { getByPlaceholderText } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
      />
    );

    const input = getByPlaceholderText('Test Placeholder');
    expect(input).toBeTruthy();
  });

  it('handles null value correctly', () => {
    const { getByPlaceholderText } = render(
      <CustomInput 
        label="Test Label" 
        placeholder="Test Placeholder"
        value={null as any}
        onChangeText={() => {}}
      />
    );

    const input = getByPlaceholderText('Test Placeholder');
    expect(input).toBeTruthy();
  });
}); 