// usePayments.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { usePayments } from './usePayments'

const mockConfirmPayment = vi.fn()
const mockUseStripe = vi.fn()
const mockUseElements = vi.fn()

vi.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => mockUseStripe(),
  useElements: () => mockUseElements()
}))

describe('usePayments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('successfully processes a payment', async () => {
    const mockPaymentIntent = {
      id: 'pi_123',
      amount: 1000,
      currency: 'cad'
    }

    mockUseStripe.mockReturnValue({
      confirmPayment: mockConfirmPayment.mockResolvedValue({
        error: undefined,
        paymentIntent: mockPaymentIntent
      })
    })

    mockUseElements.mockReturnValue({})

    const { result } = renderHook(() => usePayments())

    const paymentIntent = await act(() => result.current.pay())

    expect(mockConfirmPayment).toHaveBeenCalledWith({
      elements: {},
      redirect: 'if_required'
    })
    expect(paymentIntent).toEqual(mockPaymentIntent)
  })

  it('processing when payment is processing', async () => {
    mockUseStripe.mockReturnValue({
      confirmPayment: mockConfirmPayment.mockReturnValueOnce(new Promise(() => {}))
    })

    const { result } = renderHook(() => usePayments())

    result.current.pay()

    await waitFor(() => {
        expect(result.current.processing).toBe(true)
    })
  })

  it('throws an error if confirmPayment returns an error', async () => {
    mockUseStripe.mockReturnValue({
      confirmPayment: mockConfirmPayment.mockResolvedValue({
        error: { message: 'Card declined' }
      })
    })

    mockUseElements.mockReturnValue({})

    const { result } = renderHook(() => usePayments())

    await expect(result.current.pay()).rejects.toThrow('Card declined')
  })

  it('throws if stripe or elements is null', async () => {
    mockUseStripe.mockReturnValue(null)
    mockUseElements.mockReturnValue(null)

    const { result } = renderHook(() => usePayments())

    await expect(result.current.pay()).rejects.toThrow(
      'An error occurred, please try again. No charges have been made.'
    )
  })
})
