import { render, screen, waitFor, act } from '@testing-library/react'
import { Payment } from './Payment'
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { getElementOptionsOptions, PaymentService, PaymentType } from '../../service/PaymentService'
import { Universities } from '../../types/User'
import userEvent from '@testing-library/user-event'
import { usePayments } from '../../hooks/usePayments'
import { PaymentIntent, StripeElementsOptions } from '@stripe/stripe-js'

vi.mock('@stripe/stripe-js', async () => ({
  loadStripe: vi.fn(() => Promise.resolve({})),
}))

vi.mock('@stripe/react-stripe-js', async () => {
  const actual = await vi.importActual('@stripe/react-stripe-js')
  return {
    ...actual,
    Elements: ({ children }: { children: React.ReactNode }) => <div data-testid="elements">{children}</div>,
    PaymentElement: () => <div data-testid="payment-element" />,
  }
})

vi.mock('../../hooks/usePayments', () => ({
  usePayments: vi.fn(),
}))

vi.mock('../../service/PaymentService', () => {
  return {
    PaymentService: vi.fn(),
    PaymentType: {
      SUBSCRIPTION: 'subscription',
      ONE_TIME: 'one_time',
    },
  }
})

describe('Payment component', () => {
  let mockPay: Mock;
  let mockGetElementOptions: Mock;
  let onPayment: Mock;
  let onError: Mock;

  beforeEach(() => {
    // Mock import.meta.env
    Object.defineProperty(import.meta, 'env', {
      value: { VITE_STRIPE_KEY: 'test_stripe_key' },
      writable: true,
    })

    mockPay = vi.fn(() => Promise.resolve({ id: 'pi_123' } as PaymentIntent))
    mockGetElementOptions = vi.fn(() =>
      Promise.resolve({
        clientSecret: 'test_client_secret',
      } as StripeElementsOptions))
    onPayment = vi.fn()
    onError = vi.fn()

    vi.mocked(usePayments, { partial: true }).mockReturnValue({
      processing: false,
      pay: mockPay
    })

    vi.mocked(PaymentService, { partial: true }).mockImplementation(() => ({
      getElementsOptions: mockGetElementOptions,
    } as unknown as PaymentService))
  })

  async function renderComponent(options: getElementOptionsOptions) {
    render(
      <Payment
        onPayment={onPayment}
        onError={onError}
        options={options}
      />
    )
  }

  it('renders payment form and submission for ubc student', async () => {
    const user = userEvent.setup();
    const options: getElementOptionsOptions = {type: PaymentType.MEMBERSHIP, university: Universities[0]}

    await act(() => renderComponent(options))

    await waitFor(() => {
      expect(screen.getByTestId('payment-element')).toBeInTheDocument()
    })

    await act(() => user.click(screen.getByRole('button', { name : "Continue"})))

    expect(onPayment).toHaveBeenCalledWith({ id: 'pi_123' })
    expect(onError).not.toHaveBeenCalled()
    expect(mockGetElementOptions).toHaveBeenCalledWith(options)
  })

  it('renders payment form and submission for non ubc student', async () => {
    const user = userEvent.setup();
    const options: getElementOptionsOptions = {type: PaymentType.MEMBERSHIP, university: Universities[4]}

    await act(() => renderComponent(options))

    await waitFor(() => {
      expect(screen.getByTestId('payment-element')).toBeInTheDocument()
    })

    await act(() => user.click(screen.getByRole('button', { name : "Continue"})))

    expect(onPayment).toHaveBeenCalledWith({ id: 'pi_123' })
    expect(onError).not.toHaveBeenCalled()
    expect(mockGetElementOptions).toHaveBeenCalledWith(options)
  })


  it('calls onError when payment error', async () => {
    mockPay.mockRejectedValue(Error("payment error occurred"))
    const user = userEvent.setup();

    await act(() => renderComponent({type: PaymentType.MEMBERSHIP, university: Universities[0]}))

    await waitFor(() => {
      expect(screen.getByTestId('payment-element')).toBeInTheDocument()
    })

    await act(() => user.click(screen.getByRole('button', { name : "Continue"})))

    expect(onPayment).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(Error("payment error occurred"))
  })

  it("renders a spinner when loading", async () => {
    mockGetElementOptions.mockReturnValueOnce(new Promise(() => {}))

    await renderComponent({type: PaymentType.MEMBERSHIP, university: Universities[0]})

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("renders processing when payment is processing", async () => {
    mockPay.mockReturnValueOnce(new Promise(() => {}))
    vi.mocked(usePayments, { partial: true }).mockReturnValue({
      processing: true,
      pay: mockPay
    })
    const user = userEvent.setup()

    await act(() => renderComponent({type: PaymentType.MEMBERSHIP, university: Universities[0]}))

    await act(() => user.click(screen.getByRole('button', { name : "Continue"})))

    expect(screen.getByText("processing")).toBeInTheDocument()
    expect(onPayment).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

})
