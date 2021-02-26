import { createContext, ReactNode, useEffect, useState } from 'react'
import challenges from '../../challenges.json';
import Cookie from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';


interface Challenge {
    type: 'body' | 'eye';
    description: number;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    ExperienceToNextLevel: number,
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenges: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
    children : ReactNode;
    level: number
    currentExperience:number;
    challengesCompleted: number;
}


export const ChallengesContext = createContext( {} as ChallengesContextData );


export function ChallengesProvider({ 
    children,
    ...rest 
}: ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);

    const ExperienceToNextLevel = Math.pow((level + 1) * 4,2);

    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    useEffect(()=>{
        Notification.requestPermission();
    }, []);


    function levelUp(){
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenges(){

        const randomChallengesIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengesIndex];
        setActiveChallenge(challenge);
        new Audio('/notification.mp3').play();
        if(Notification.permission === 'granted'){
            new Notification('Novo desafio!!!', {
                body: `Valendo ${challenge.amount}xp!`
            });
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge(){
        if(!activeChallenge){
            return;
        }

        const { amount } = activeChallenge; 

        let finalExperience = currentExperience + amount;

        if(finalExperience >= ExperienceToNextLevel) {
            finalExperience = finalExperience - ExperienceToNextLevel;
            levelUp();
        }
        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted +1);

    }

    useEffect(() => {
        Cookie.set('level', String(level));
        Cookie.set('currentExperience', String(currentExperience));
        Cookie.set('challengesCompleted', String(challengesCompleted));
    },[level,currentExperience,challengesCompleted]);

    return (
        <ChallengesContext.Provider
            value={{
                level,
                currentExperience,
                challengesCompleted,
                levelUp,
                startNewChallenges,
                activeChallenge,
                resetChallenge,
                ExperienceToNextLevel,
                completeChallenge,
                closeLevelUpModal
            }} 
        >
            { children }

            {  isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    );


}













