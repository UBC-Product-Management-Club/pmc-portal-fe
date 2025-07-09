import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserService } from './useUserService'
import type { PaymentIntent } from '@stripe/stripe-js'
import type { UserDocument } from '../types/User'

const mockFetch = vi.fn()
const mockCreate = vi.fn()

vi.mock('../service/UserService', () => {
  return {
    UserService: vi.fn().mockImplementation(() => ({
      fetch: mockFetch,
      create: mockCreate
    }))
  }
})

describe('useUserService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUser: UserDocument = {
    id: 'user123',
    email: 'test@example.com',
    university: "University of British Columbia",
    displayName: "geary",
    firstName: "geary",
    lastName: "abc",
    pfp: "url",
    pronouns: "",
    whyPm: "abc"
  }

  const mockPayment: PaymentIntent = {
    id: 'pi_123',
    client_secret: 'secret_abc',
    amount: 1000,
    currency: 'usd',
  } as PaymentIntent

  it('fetches user with userId', async () => {
    mockFetch.mockResolvedValueOnce(mockUser)

    const { result } = renderHook(() => useUserService())
    const res = await result.current.get('user123')

    expect(mockFetch).toHaveBeenCalledWith('user123')
    expect(res).toEqual(mockUser)
  })

  it('fetches non-existing user', async () => {
    mockFetch.mockRejectedValueOnce(new Error("User not found!"))

    const { result } = renderHook(() => useUserService())
    await expect(result.current.get("unknown-user")).rejects.toThrowError("User not found!")
  })

  it('calls create with user and payment', async () => {
    const { result } = renderHook(() => useUserService())
    await result.current.create({ email: 'x@example.com' }, mockPayment)

    expect(mockCreate).toHaveBeenCalledWith({ email: 'x@example.com' }, mockPayment)
  })
})
