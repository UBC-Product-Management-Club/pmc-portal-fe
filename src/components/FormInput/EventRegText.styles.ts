import styled from 'styled-components';

export const TextAreaWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledTextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  min-height: 144px;
  padding: 16px;
  border-radius: 8px;
  background-color: #2b2d42;
  border: 1px solid ${props => props.hasError ? '#cc3333' : 'transparent'};
  color: #ffffff;
  resize: none;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#cc3333' : '#4a4d6e'};
  }
`;

export const CharacterCount = styled.div`
  position: absolute;
  bottom: 12px;
  right: 16px;
  color: #8d8f9a;
  font-size: 14px;
`; 