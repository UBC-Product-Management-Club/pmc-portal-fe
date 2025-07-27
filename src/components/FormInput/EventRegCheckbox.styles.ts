import styled from 'styled-components';

export const CheckboxGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const CheckboxLabel = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    margin-bottom: 8px;
`;

export const CheckboxItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const CheckboxInput = styled.input`
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: #5c5cff;
`;

export const OptionLabel = styled.label`
    cursor: pointer;
    color: #fff;
    font-size: 14px;
`;
