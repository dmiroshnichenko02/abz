

import './abzHeader.scss';

import logotype from '../../assets/img/Logo.svg';

const AbzHeader = () => {
    return (
        <div className="header">
            <div className="container">
                <div className="header__wrapper">
                    <img src={logotype} alt="logotype" />
                    <div className="header__buttons">
                        <button className="header__users btn btn__active">Users</button>
                        <button className="header__signUp btn btn__active">Sing up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AbzHeader;