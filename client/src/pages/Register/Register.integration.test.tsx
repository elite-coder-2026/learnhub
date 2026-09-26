import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement } from 'react'
import { theme } from '../../theme'
import { AuthProvider } from '../../hooks/useAuth'
import Register from './index'

function renderWithProviders(ui: ReactElement): ReturnType<typeof render> {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <MemoryRouter>{ui}</MemoryRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  )
}

describe('Register (integration with useRegister + registerUser)', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const fillValidForm = async (user: ReturnType<typeof userEvent.setup>): Promise<void> => {
    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm password'), 'password123')
  }

  it('posts to /auth/register with the form payload and shows the success message', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: { token: 'jwt-token', userId: 'user-1' } }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const user = userEvent.setup()
    renderWithProviders(<Register />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByRole('status')).toHaveTextContent('Account created. You can now sign in.')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toMatch(/\/auth\/register$/)
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual({
      email: 'ada@example.com',
      password: 'password123',
      firstName: 'Ada',
      lastName: 'Lovelace',
      userRole: 'student',
    })
  })

  it('surfaces the backend error message when registration fails', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const user = userEvent.setup()
    renderWithProviders(<Register />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Email already registered')
  })

  it('shows a generic error when the response has no error body', async () => {
    fetchMock.mockResolvedValue(new Response('', { status: 500 }))

    const user = userEvent.setup()
    renderWithProviders(<Register />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Registration failed (500)')
  })
})
