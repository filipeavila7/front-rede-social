import '../styles/Messages.css'
import CardsMessages from '../components/CardsMessages'
import ContatoNav from '../components/ContatosNav'
function Messages (){
    return(
        <div className="message-layout">
            <ContatoNav/>
            <div className='message-content'>
                <CardsMessages/>
            </div>
        </div>
    )
}


export default Messages
