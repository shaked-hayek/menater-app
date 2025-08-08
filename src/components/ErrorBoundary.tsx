import { errorHandler } from 'actions/errors/errorHandler';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { showError } from 'store/slices/errorSlice';


class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        const { dispatch } = this.props;
        errorHandler(dispatch, "We encountered un unexpected error", error);
    }

    render() {
        return this.props.children;
    }
}

export default connect(null, { showError })(ErrorBoundary);
