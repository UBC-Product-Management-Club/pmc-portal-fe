import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { ActionTypes, useUserData } from '../../providers/UserData/UserDataProvider';
import { useUserService } from '../../hooks/useUserService';
import Onboarding from './Onboarding';
import { describe, it, vi, beforeEach, Mock, expect } from 'vitest';
import { usePaymentService } from '../../hooks/usePaymentService';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { Universities } from '../../types/User';
import { PaymentProps } from '../Payment/Payment';
import { PaymentIntent } from '@stripe/stripe-js';
import { BrowserRouter } from 'react-router-dom';

vi.mock('@auth0/auth0-react');
vi.mock('../../providers/UserData/UserDataProvider');
vi.mock('../../hooks/useUserService');
vi.mock('../../hooks/usePaymentService');
vi.mock('../Payment/Payment', () => ({
    Payment: ({ onPayment, onError, options }: PaymentProps) => {
        return (
            <div data-testid="mock-payment">
                <button onClick={() => onPayment({ status: 'succeeded' } as PaymentIntent)}>
                    Mock Pay
                </button>
                <button onClick={() => onError(new Error('Mock Error'))}>Mock Error</button>
                <div>{options.type}</div>
                {/* <div>{options.type === PaymentType.MEMBERSHIP ? options.university : options.eventId}</div> */}
            </div>
        );
    },
}));

describe('Onboarding Component', () => {
    let mockUpdateUser: Mock;
    let mockCreateUser: Mock;
    let getMembershipFee: Mock;
    let getPaymentElementOptions: Mock;
    let getElementsOptions: Mock;
    let mockLogout: Mock;

    const mockFee = {
        ubcPrice: 1500,
        nonUbcPrice: 2000,
    };

    beforeEach(() => {
        vi.resetAllMocks();
        mockUpdateUser = vi.fn();
        mockCreateUser = vi.fn();
        getMembershipFee = vi.fn().mockResolvedValue(mockFee);
        getPaymentElementOptions = vi.fn().mockReturnValue({
            layout: 'tabs',
            wallets: {
                applePay: 'never',
                googlePay: 'never',
            },
        });
        getElementsOptions = vi.fn().mockResolvedValue({
            clientSecret: 'test_client_secret',
        });
        mockLogout = vi.fn();

        vi.mocked(useAuth0, { partial: true }).mockReturnValue({
            isAuthenticated: true,
            logout: mockLogout,
            user: {
                name: 'geary',
                email: 'geary@ubcpmc.com',
                sub: 'userId',
                picture: 'link_to_pfp',
            },
        });

        vi.mocked(useUserService, { partial: true }).mockReturnValue({
            create: mockCreateUser,
        });

        vi.mocked(useUserData).mockReturnValue({
            user: {
                id: 'userId',
                displayName: 'geary',
                email: 'geary@ubcpmc.com',
            },
            update: mockUpdateUser,
        });

        vi.mocked(usePaymentService).mockReturnValue({
            getPaymentElementOptions: getPaymentElementOptions,
            getMembershipFee: getMembershipFee,
            getElementsOptions: getElementsOptions,
            getMembershipFeeElementsOptions: vi.fn(),
        } as unknown as ReturnType<typeof usePaymentService>);
    });

    async function renderComponent() {
        render(
            <BrowserRouter>
                <Onboarding />
            </BrowserRouter>
        );
    }

    async function fillOnboarding(user: UserEvent, ubc: boolean) {
        const firstNameInput = screen.getByPlaceholderText('First name');
        const lastNameInput = screen.getByPlaceholderText('Last name');
        const pronounsInput = screen.getByPlaceholderText('Pronouns');
        const universityInput = screen.getByTestId('university-dropdown');

        await user.type(firstNameInput, 'geary');
        await user.type(lastNameInput, 'pmc');
        await user.type(pronounsInput, 'he/him');

        if (ubc) {
            fireEvent.change(universityInput, { target: { value: Universities[0] } });

            const studentIdInput = screen.getByPlaceholderText('Student ID');
            const facultyInput = screen.getByPlaceholderText('Faculty');
            const majorInput = screen.getByPlaceholderText('Major');
            const yearInput = screen.getByTestId('year-dropdown');

            await user.type(studentIdInput, '12345667');
            await user.type(facultyInput, 'sauder');
            await user.type(majorInput, 'product management');
            fireEvent.change(yearInput, { target: { value: '5+' } });

            const waiverCheckbox = screen.getByRole('checkbox');
            await user.click(waiverCheckbox);
        } else {
            fireEvent.change(universityInput, { target: { value: Universities[4] } });
        }

        const whyPmInput = screen.getByPlaceholderText('Why Product Management?');
        await user.type(whyPmInput, 'products go brr');

        const submitButton = screen.getByRole('button', { name: 'Continue to Payment' });
        await user.click(submitButton);
    }

    it('renders onboarding form', async () => {
        await renderComponent();

        expect(screen.getByText("Let's get you signed up!")).toBeInTheDocument();
    });

    it('renders login page if not authenticated', async () => {
        vi.mocked(useAuth0).mockReturnValue({
            isAuthenticated: false,
            user: undefined,
        } as unknown as ReturnType<typeof useAuth0>);

        await renderComponent();

        expect(screen.getByText('please refresh the page')).toBeInTheDocument();
    });

    it('for ubc students', async () => {
        const user = userEvent.setup();
        await renderComponent();

        await fillOnboarding(user, true);

        expect(mockUpdateUser).toHaveBeenCalledWith({
            type: ActionTypes.UPDATE,
            payload: {
                firstName: 'geary',
                lastName: 'pmc',
                pronouns: 'he/him',
                university: 'University of British Columbia',
                studentId: '12345667',
                year: '5+',
                faculty: 'sauder',
                major: 'product management',
                whyPm: 'products go brr',
            },
        });
        expect(screen.getByTestId('mock-payment')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Mock Pay' }));

        expect(mockCreateUser).toHaveBeenCalled();
        expect(screen.getByText(/Welcome to PMC/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue to dashboard' })).toBeInTheDocument();
    });

    it('for non students', async () => {
        const user = userEvent.setup();
        await renderComponent();

        await fillOnboarding(user, false);

        expect(mockUpdateUser).toHaveBeenCalledWith({
            type: ActionTypes.UPDATE,
            payload: {
                firstName: 'geary',
                lastName: 'pmc',
                pronouns: 'he/him',
                university: "I'm not a university student",
                whyPm: 'products go brr',
            },
        });
        expect(screen.getByTestId('mock-payment')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Mock Pay' }));

        expect(mockCreateUser).toHaveBeenCalled();
        expect(screen.getByText(/Welcome to PMC/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue to dashboard' })).toBeInTheDocument();
    });

    it('navigates back correctly from onboarding', async () => {
        const user = userEvent.setup();
        await renderComponent();
        const backBtn = screen.getByRole('button', { name: 'Back' });

        expect(backBtn).toBeInTheDocument();

        await user.click(backBtn);

        expect(mockLogout).toHaveBeenCalled();
    });

    it('navigates back correctly from payment', async () => {
        const user = userEvent.setup();
        await renderComponent();
        const backBtn = screen.getByRole('button', { name: 'Back' });

        await fillOnboarding(user, true);

        expect(backBtn).toBeInTheDocument();

        await user.click(backBtn);

        expect(mockLogout).not.toBeCalled();
    });
});
