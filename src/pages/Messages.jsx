import '../styles/Messages.css'
import { useEffect, useState } from 'react'
import CardsMessages from '../components/CardsMessages'
import ContatoNav from '../components/ContatosNav'

function Messages() {
    const [refreshContacts, setRefreshContacts] = useState(false)
    const [isNavOpen, setIsNavOpen] = useState(() => {
        if (typeof window === "undefined") return true
        return window.innerWidth > 900
    })

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 900) {
                setIsNavOpen(true)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    function triggerRefreshContacts() {
        setRefreshContacts(prev => !prev)
    }

    return (
        <div className={`message-layout ${isNavOpen ? "nav-open" : "nav-closed"}`}>
            <button
                type="button"
                className={`messages-nav-toggle ${isNavOpen ? "is-open" : "is-closed"}`}
                onClick={() => setIsNavOpen(prev => !prev)}
                aria-label={isNavOpen ? "Fechar conversas" : "Abrir conversas"}
                aria-expanded={isNavOpen}
            >
                <span className="messages-nav-toggle-icon">☰</span>
            </button>

            <ContatoNav
                refreshContacts={refreshContacts}
                isOpen={isNavOpen}
                onConversationSelect={() => {
                    if (window.innerWidth <= 900) {
                        setIsNavOpen(false)
                    }
                }}
            />

            <div className='message-content'>
                <CardsMessages
                    onMessageSent={triggerRefreshContacts}
                    isNavOpen={isNavOpen}
                />
            </div>
        </div>
    )
}

export default Messages
