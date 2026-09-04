import { render, screen, type RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { UseMutationResult } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import type { ReactElement } from 'react'
import { theme } from '../../theme'
import type { RegisterRequest, RegisterResult } from '../../types/auth'
import Register from './index'

function renderWithTheme(ui: ReactElement): RenderResult {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

const mutate = vi.fn()

function mockMutationResult(
  overrides: Partial<UseMutationResult<RegisterResult, Error, RegisterRequest>>,
): UseMutationResult<RegisterResult, Error, RegisterRequest> {
  const base = {
    data: undefined,
    error: null,
    failureCount: 0,
    failureReason: null,
    isError: false,
    isIdle: true,
    isPaused: false,
    isPending: false,
    isSuccess: false,
    mutate,
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    status: 'idle' as const,
    variables: undefined,
    submittedAt: 0,
    context: undefined,
  }
  return { ...base, ...overrides } as UseMutationResult<RegisterResult, Error, RegisterRequest>
}

let mutationResult: UseMutationResult<RegisterResult, Error, RegisterRequest> = mockMutationResult({})

vi.mock('../../hooks/useRegister', () => ({
  useRegister: () => mutationResult,
}))

describe('Register (unit)', () => {
  beforeEach(() => {
    mutate.mockClear()
    mutationResult = mockMutationResult({})
  })

  it('renders all fields inside a labelled form', () => {
    renderWithTheme(<Register />)

    expect(screen.getByLabelText('First name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Student' })).toBeInTheDocument()
  })

  it('shows validation errors and does not call mutate when the form is invalid', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Register />)

    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText('Enter your first name')).toBeInTheDocument()
    expect(screen.getByText('Enter your last name')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
    expect(mutate).not.toHaveBeenCalled()
  })

  it('flags mismatched passwords', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Register />)

    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm password'), 'different123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
    expect(mutate).not.toHaveBeenCalled()
  })

  it('opens the role dropdown, selects instructor, and submits the trimmed payload', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Register />)

    await user.type(screen.getByLabelText('First name'), '  Ada  ')
    await user.type(screen.getByLabelText('Last name'), '  Lovelace  ')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm password'), 'password123')

    await user.click(screen.getByRole('button', { name: 'Student' }))
    await user.click(screen.getByRole('option', { name: 'Instructor' }))

    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(mutate).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'password123',
      firstName: 'Ada',
      lastName: 'Lovelace',
      userRole: 'instructor',
    })
  })

  it('closes the role dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Register />)

    await user.click(screen.getByRole('button', { name: 'Student' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.click(document.body)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows the server error message when the mutation fails', () => {
    mutationResult = mockMutationResult({
      isError: true,
      error: new Error('Email already registered'),
    })
    renderWithTheme(<Register />)

    expect(screen.getByRole('alert')).toHaveTextContent('Email already registered')
  })

  it('shows a success message and calls onSuccess when the mutation succeeds', () => {
    const onSuccess = vi.fn()
    mutationResult = mockMutationResult({ isSuccess: true })
    renderWithTheme(<Register onSuccess={onSuccess} />)

    expect(screen.getByRole('status')).toHaveTextContent('Account created. You can now sign in.')
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('disables the submit button and shows pending text while submitting', () => {
    mutationResult = mockMutationResult({ isPending: true })
    renderWithTheme(<Register />)

    const button = screen.getByRole('button', { name: /creating account/i })
    expect(button).toBeDisabled()
  })

  it('links to the provided login href', () => {
    renderWithTheme(<Register loginHref="/sign-in" />)
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/sign-in')
  })
})
