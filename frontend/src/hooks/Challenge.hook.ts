import { useAuthContext } from "@/Context/AuthContext"
import axiosFetch from "@/lib/axiosFetch"
import { Challenge, ChallengeResultData } from "@/types/Challenge.type"
import { useMultiplayer } from "@/zustand/ChallengeResult.zustand"
import { useQuery } from "@tanstack/react-query"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

type Setter<T = any> = Dispatch<SetStateAction<T>>

const useChallenge = () => {
    const GameStarted = useMultiplayer(state => state.GameStarted) // this is use for multiplayer
    const [timetoStart, setTimetoStart] = useState<number>(3)
    const [searchParams] = useSearchParams()
    const { user } = useAuthContext()

    const calculateWPM = (challenge: string, time: number) => {
        return Math.round((challenge.length / 5) / (time / 60))
    }

    const calculateAccuracy = (typed: string, challenge: string) => {
        let correctCount = 0;
        typed.split("").forEach((value, idx) => {
            if (value === challenge[idx]) {
                correctCount++;
            }
        });

        const percentage = (correctCount / challenge.length) * 100;
        return Math.round(percentage)
    } 

    const handleKeyDown = async (setTyped: Setter<string>, setKeyUp: Setter<string>, e: KeyboardEvent) => {
        // Check if the key is a printable character (excluding function keys and system keys)
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey && !e.repeat) {
            setTyped(prev => prev + e.key);
            setKeyUp(e.key);
        } else if (e.key === "Backspace") {
            setTyped(prev => prev.slice(0, -1));
            setKeyUp(e.key);
        } else if (e.key === " ") {
            setTyped(prev => prev + " ");
            setKeyUp(e.key);
        } 
        await new Promise(resolve => setTimeout(resolve, 130));
        setKeyUp('');
    }

    const getChallenge = async (challengeId: string) => {

        const response = await axiosFetch.get(`/challenge/getChallenge?challengeId=${challengeId}`)
        
        if (response.status === 404) {
            // handle erorr
            return window.location.assign('/error?message=cannot+find+page')
        }

        if (response.data === undefined) {
            return window.location.assign('/error?message=cannot+find+page')
        }

        return response.data as Challenge
    }

    const SendChallengeResult = async (challengeResult: ChallengeResultData) => {

        const response = await axiosFetch.post("/challenge/challengeResult", challengeResult) 
    
        if (response.status >= 400) {
            throw new Error(response.data.message)
        }
        
        return response.data
    }

    const { data: challengeData, isLoading } = useQuery({
        queryKey: ['challenge', searchParams.get('challengeId')],
        queryFn: async () => getChallenge(searchParams.get('challengeId') || ''),
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if(user?.Player?.room?.roomStatus === "started") {
            setTimetoStart(0)
        }

        if(timetoStart === 0 || isLoading || (!GameStarted && searchParams.get('mode') === 'multiplayer')) {
            return
        }   
          
        const timetoStartTimer = setTimeout(() => {
            setTimetoStart(prev => {
                if (prev === 0) {
                    return 0
                }    
                
                return prev - 1
            })
        }, 1000)

        return () => {
            clearTimeout(timetoStartTimer)
        }
    }, [timetoStart, isLoading, GameStarted, searchParams.get('mode')])    

    return {
        calculateAccuracy, calculateWPM, handleKeyDown, SendChallengeResult, timetoStart, setTimetoStart,
        isLoading, challengeData
    }
}

export default useChallenge