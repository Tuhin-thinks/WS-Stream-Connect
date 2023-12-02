import { useEffect } from 'react'
import { useWSConnector } from '../hooks/useWSConnector'

export const StreamDash = () => {
    const [ws, retryCount, data] = useWSConnector()

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <span>Status:</span>
                    <span>{retryCount}</span>
                </div>
            </header>
        </div>
    )
}
