import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinalistCard } from './FinalistCard';

describe('FinalistCard', () => {
    it('shows nothing before results are published (field left out)', () => {
        const { container } = render(<FinalistCard isFinalist={undefined} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('shows nothing for a team that is not a finalist', () => {
        const { container } = render(<FinalistCard isFinalist={false} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('shows the card for a finalist team', () => {
        render(<FinalistCard isFinalist />);
        expect(screen.getByText('Finalist')).toBeInTheDocument();
    });
});
