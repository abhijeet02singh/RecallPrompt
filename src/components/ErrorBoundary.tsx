import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in component tree and displays fallback UI
 * Prevents exposure of stack traces and internal application structure to users
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details in development only
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // Reload the page to reset application state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF6ED] dark:bg-[#22201D]">
          <div className="max-w-md w-full text-center">
            <div className="p-6 sm:p-8 bg-[#FAF6ED] dark:bg-[#22201D] border-[3px] border-[#B91C4A] dark:border-[#E11D48] shadow-retro-lg paperclip">
              <div className="mb-6">
                <span className="font-mono text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#B91C4A] text-white shadow-retro-sm">
                  ERROR
                </span>
              </div>
              
              <h1 className="font-display text-3xl sm:text-4xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide mb-4">
                Something went wrong
              </h1>
              
              <p className="text-sm text-[#78716C] dark:text-[#A8A29E] font-body mb-6 leading-relaxed">
                An unexpected error occurred. The application has been reset to prevent data corruption.
              </p>
              
              <button
                onClick={this.handleReset}
                className="btn-retro w-full px-6 py-3 min-h-[48px] bg-[#1E5F64] text-white font-display text-lg tracking-wider uppercase cursor-pointer hover:bg-[#184F53] transition-all"
              >
                Reload Application
              </button>
              
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="font-mono text-xs text-[#78716C] dark:text-[#A8A29E] cursor-pointer hover:text-[#1C1917] dark:hover:text-[#FAF6ED]">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 p-3 bg-[#F8F4EA] dark:bg-[#181715] border border-[#1C1917] dark:border-[#FAF6ED] text-xs font-mono text-[#B91C4A] dark:text-[#E11D48] overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
