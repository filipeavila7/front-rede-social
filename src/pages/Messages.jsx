import '../styles/Messages.css'
import { useState } from 'react'
import CardsMessages from '../components/CardsMessages'
import ContatoNav from '../components/ContatosNav'

function Messages() {
    const [refreshContacts, setRefreshContacts] = useState(false)

    function triggerRefreshContacts() {
        setRefreshContacts(prev => !prev)
    }

    return (
        <div className="message-layout">
            <ContatoNav refreshContacts={refreshContacts} />

            <div className='message-content'>
                <CardsMessages onMessageSent={triggerRefreshContacts} />
            </div>
        </div>
    )
}

export default Messages