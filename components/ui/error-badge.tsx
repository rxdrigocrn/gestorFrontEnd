import React from 'react';

interface ErrorBadgeProps {
    message: string;
    className?: string;
    onRetry?: () => void;
}

const ErrorBadge: React.FC<ErrorBadgeProps> = ({
    message,
    className = '',
    onRetry
}) => {
    return (
        <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 ${className}`}
        >
            <svg
                className="w-4 h-4 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                />
            </svg>
            <span>{message}</span>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="ml-2 text-red-600 hover:text-red-800 font-semibold focus:outline-none"
                >
                    Tentar novamente
                </button>
            )}
        </div>
    );
};

export default ErrorBadge;