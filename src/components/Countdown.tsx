
import { useContext } from 'react';
import styles from '../styles/components/Countdown.module.css';
import {CountdownContext} from '../contexts/CountdownContext';

let countdownTimeOut: NodeJS.Timeout;

export function Countdown() {
    const { 
        minutes,
        seconds,
        hasFinished,
        isActive,
        startCountdown,
        resetCountdown
     } = useContext(CountdownContext);


    const [minutesLeft, minutesRight] = String(minutes).padStart(2, '0').split('');
    const [secondsLeft, secondsRight] = String(seconds).padStart(2, '0').split('');


    return (
        <div>
            <div className={ styles.CountdownContainer }>
                <div>
                    <span>{ minutesLeft }</span>
                    <span>{ minutesRight }</span>
                </div>
                <span> : </span>
                <div>
                    <span>{ secondsLeft }</span>
                    <span>{ secondsRight }</span>
                </div>
            </div>

            { hasFinished ? (
                <button 
                    disabled
                    className={styles.CountdownButton}
                >
                    Ciclo encerrado
                </button>
            ) : (
                <>
                    { isActive ? (
                        <button 
                            type="button" 
                            className={ `${ styles.CountdownButton } ${ styles.CountdownButtonActive }` }
                            onClick={ resetCountdown }
                        >
                            Abandonar Ciclo
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            className={ styles.CountdownButton }
                            onClick={startCountdown}
                        >
                            Iniciar um ciclo
                        </button>
                    ) }
                </>
            )}

            

            

            
        </div>
    );
}