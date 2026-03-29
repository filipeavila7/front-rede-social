import '../styles/StatusCard.css'
import CardSeguidores from './CardsSeguidores'
import UserProfileStatus from './UserProfileStatus'

function StatusCard(){
    return(
        <div className="cards-container">
            <UserProfileStatus/>
            <CardSeguidores/>
        </div>
    )
}

export default StatusCard