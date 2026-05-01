import '../styles/StatusCard.css'
import CardSeguidores from './CardsSeguidores'
import UserProfileStatus from './UserProfileStatus'

function StatusCard(){
    return(
        <main className='cards-seguidores-layout'>
        <div className="cards-container">
            <UserProfileStatus/>
            <CardSeguidores/>
        </div>
        </main>
    )
}

export default StatusCard