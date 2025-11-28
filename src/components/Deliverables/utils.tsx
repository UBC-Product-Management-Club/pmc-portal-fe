import styled from 'styled-components';

const CardsWrapper = styled.div`
    height: calc(100vh * 2 / 3);
    display: flex;
    gap: 1.5rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const CardVerticalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    flex: 1;
`;

const Card = styled.div`
    flex: 1 1 300px;
    min-width: 0;
    border: 1px solid rgba(141, 155, 235, 0.2);
    border-radius: 0.75rem;
    background-color: var(--pmc-midnight-blue);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
`;

const CardHeader = styled.div`
    padding: 0.5rem 1.5rem 0 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CardTitle = styled.h2`
    font-size: 1rem;
    font-weight: 600;
    color: #7f838f;
`;

const CardContent = styled.div<{ center?: boolean }>`
    padding: 0 1.5rem 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow-y: auto;

    ${({ center }) =>
        center &&
        `
        align-items: center;  /* horizontal centering */
        text-align: center;   /* text centering */
        justify-content: center; /* vertical centering */
        height: 150px;        /* optional: adjust for visual centering */
    `}
`;

const CountdownNumbers = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
`;

const TimeBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
`;

const TimeValue = styled.span`
    font-size: 4rem;
    font-weight: bold;
    color: #ffffff;
`;

const TimeLabel = styled.span`
    font-size: 1rem;
    color: var(--pmc-light-grey);
    text-transform: uppercase;
`;

const CountdownText = styled.p`
    font-size: 1rem;
    color: var(--pmc-light-grey);
    text-align: center;
    margin: 0;
    margin-bottom: 0.25rem;
    font-weight: 500;
`;

export {
    CardsWrapper,
    CardVerticalWrapper,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CountdownNumbers,
    TimeBlock,
    TimeValue,
    TimeLabel,
    CountdownText,
};
