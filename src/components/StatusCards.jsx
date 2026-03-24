import '../styles/StatusCard.css'
import CardSeguidores from './CardsSeguidores'

function StatusCard(){
    return(
        <div className="cards-container">
            <CardSeguidores/>
            <CardSeguidores/>
            <CardSeguidores/>
            <CardSeguidores/>
        </div>
    )
}

export default StatusCard