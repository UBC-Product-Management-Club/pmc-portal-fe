import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { UserDataForm } from './UserDataForm';
import { fireEvent, screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { UserDataFromUser } from '../../types/User';

describe('UserDataForm', () => {
    let mockSubmit: Mock;

    async function renderComponent(hasWaiver: boolean, responses?: UserDataFromUser) {
        render(
            <UserDataForm responses={responses ?? {}} onSubmit={mockSubmit} hasWaiver={hasWaiver} />
        );
    }

    beforeEach(() => {
        mockSubmit = vi.fn();
    });

    it('renders the form initial state', async () => {
        await renderComponent(true);

        expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Pronouns')).toBeInTheDocument();
        expect(screen.getByTestId('university-dropdown')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Why Product Management?')).toBeInTheDocument();
    });

    describe('conditionally renders', () => {
        it('renders correct fields for ubc student', async () => {
            await renderComponent(true);

            fireEvent.change(screen.getByTestId('university-dropdown'), {
                target: { value: 'University of British Columbia' },
            });

            expect(screen.getByPlaceholderText('Student ID')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Faculty')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Major')).toBeInTheDocument();
            expect(screen.getByTestId('year-dropdown')).toBeInTheDocument();
        });

        it('major/faculty/year input if uni student', async () => {
            await renderComponent(true);

            fireEvent.change(screen.getByTestId('university-dropdown'), {
                target: { value: 'Other' },
            });

            expect(screen.queryByPlaceholderText('Student ID')).not.toBeInTheDocument();
            expect(screen.getByPlaceholderText('Faculty')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Major')).toBeInTheDocument();
            expect(screen.getByTestId('year-dropdown')).toBeInTheDocument();
        });

        it('neither if not uni student', async () => {
            await renderComponent(true);

            fireEvent.change(screen.getByTestId('university-dropdown'), {
                target: { value: "I'm not a university student" },
            });

            expect(screen.queryByPlaceholderText('Student ID')).not.toBeInTheDocument();
            expect(screen.queryByPlaceholderText('Faculty')).not.toBeInTheDocument();
            expect(screen.queryByPlaceholderText('Major')).not.toBeInTheDocument();
            expect(screen.queryByTestId('year-dropdown')).not.toBeInTheDocument();
        });
    });

    describe('waiver', () => {
        it('renders for ubc students if enabled', async () => {
            await renderComponent(true);

            fireEvent.change(screen.getByTestId('university-dropdown'), {
                target: { value: 'University of British Columbia' },
            });

            expect(screen.getByRole('checkbox')).toBeInTheDocument();
        });

        it('doesnt render for ubc students if disabled', async () => {
            await renderComponent(false);

            fireEvent.change(screen.getByTestId('university-dropdown'), {
                target: { value: 'University of British Columbia' },
            });

            expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
        });

        it('doesnt render for non-ubc', async () => {
            await renderComponent(false);

            fireEvent.change(screen.getByTestId('university-dropdown'), {
                target: { value: 'Simon Fraser University' },
            });

            expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
        });
    });

    it('renders with previous responses', async () => {
        const user: UserDataFromUser = {
            firstName: 'geary',
            lastName: 'da goat',
            pronouns: 'he/hee',
            university: 'University of British Columbia',
            year: '5+',
            studentId: 12345678,
            faculty: 'sauder',
            major: 'product management',
            whyPm: 'gear noises',
        };
        await renderComponent(true, user);

        Object.values(user).forEach((value) =>
            expect(screen.getByDisplayValue(value)).toBeInTheDocument()
        );
    });
});
