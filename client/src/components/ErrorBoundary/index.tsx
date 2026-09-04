import { Component, type ErrorInfo, type ReactNode } from 'react'
import * as S from './ErrorBoundary.styles'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error in component tree:', error, errorInfo)
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      this.props.fallback ?? (
        <S.Container role="alert">
          <S.Title>Something went wrong</S.Title>
          <S.Message>Please refresh the page. If the problem continues, contact support.</S.Message>
        </S.Container>
      )
    )
  }
}

export default ErrorBoundary
