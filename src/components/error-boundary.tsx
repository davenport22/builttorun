import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
          <h1 style={{ color: '#dc2626' }}>Something went wrong</h1>
          <p style={{ color: '#666', marginTop: '1rem' }}>{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#00677F',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
