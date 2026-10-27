import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="container error-box">
          <div className="empty__icon">💥</div>
          <h2>Бир нерсе туура эмес болуп калды</h2>
          <p>{String(this.state.error.message || this.state.error)}</p>
          <div className="row-gap">
            <button className="btn" onClick={() => this.setState({ error: null })}>Кайра аракет кылуу</button>
            <a className="btn btn--ghost" href="/">Башкы бетке</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
