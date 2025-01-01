import styled from 'styled-components';

export const FileUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;

export const UploadLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #FFF;
  margin-bottom: 8px;
`;

export const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: white;
  border: 2px solid #5C5CFF;
  border-radius: 24px;
  color: #5C5CFF;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f8ff;
  }
`;

export const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f8f8ff;
  border-radius: 8px;
`;

export const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #3B3B54;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const ProgressBar = styled.div<{ progress: number }>`
  flex: 1;
  height: 8px;
  background-color: #E0E0E0;
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: #5C5CFF;
    transition: width 0.3s ease;
  }
`; 