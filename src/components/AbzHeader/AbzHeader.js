
// Style file
import './abzHeader.scss';
// Logotype
import logotype from '../../assets/img/Logo.svg';
// Header component render
const AbzHeader = () => {
    return (
        <div className="header">
            <div className="container">
                <div className="header__wrapper">
                    <img src={logotype} alt="logotype" />
                    <div className="header__buttons">
                        <button className="header__users btn btn__active" onClick={() => {
                            const element = document.getElementById("user-cards");
                            element.scrollIntoView({ behavior: "smooth" });
                        }}>Users</button>
                        <button className="header__signUp btn btn__active" onClick={() => {
                            const element = document.getElementById("user-signUp");
                            element.scrollIntoView({ behavior: "smooth" });
                        }}>Sing up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AbzHeader;