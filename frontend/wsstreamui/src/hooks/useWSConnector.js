// custom hook to allow a component to connect to the websocket
// and receive messages from the server containing the stream data
import { useEffect, useState } from 'react'

const wsURL = 'ws://localhost:8080/ws'
const MAX_RETRY_COUNT = 20
const RETRY_INTERVAL = 500 // in milliseconds

export const useWSConnector = () => {
    const [websocket, setWebsocket] = useState(null)
    const [retryCount, setRetryCount] = useState(0)
    const [data, setData] = useState(null)

    useEffect(() => {
        const maxRetriedConnections = async (prevConnection = null) => {
            const connection = prevConnection
                ? prevConnection
                : new WebSocket(wsURL)

            if (MAX_RETRY_COUNT <= 0) return connection // Returns in whatever state it is currently

            return new Promise((resolve) => {
                connection.onopen = () => {
                    setWebsocket(connection)
                    setRetryCount(0)
                    resolve(connection)
                }

                connection.onclose = (event) => {
                    if (retryCount < MAX_RETRY_COUNT) {
                        setRetryCount(retryCount + 1)
                        setTimeout(
                            () => maxRetriedConnections(connection),
                            RETRY_INTERVAL
                        )
                    } else {
                        console.error(
                            `WebSocket failed after ${MAX_RETRY_COUNT} retries. Closing connection.`,
                            event
                        )
                        resolve(connection)
                    }
                }

                connection.onerror = (event) => {
                    console.error('WebSocket error:', event)
                }
            })
        }

        maxRetriedConnections()

        // Cleanup on unmount or if wsURL changes
        return () => {
            if (websocket) {
                websocket.close()
            }
        }
    }, [wsURL, retryCount])

    return [websocket, retryCount, data]
}
