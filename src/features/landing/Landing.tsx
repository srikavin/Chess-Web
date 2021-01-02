import React from "react";
import {Button} from "../../components/Button/Button";
import {GameBoard} from "../game/GameBoard";
import {Link} from 'react-router-dom';
import styles from './Landing.module.css'

export function Landing() {
    return (
        <>
            <div className={`container mx-auto flex flex-row w-screen h-screen ${styles.hero}`}>
                <div className="flex-none px-10">
                    <h1 className="text-9xl font-thin text-blue-600">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 ">
                            Bishop
                        </span>
                    </h1>
                    <div className="text-5xl font-sans my-8">
                        A free and open <br/>
                        source chess server.
                    </div>
                    <Link to={'/register'}>
                        <Button onClick={() => 1} className="">
                            Join Now
                        </Button>
                    </Link>
                </div>

                <div className="flex-auto max-w-xl max-h-4 origin-bottom-left">
                    <Link to={'/games/OvlnJe3B5Trle1tA'}>
                        <GameBoard game_id={"OvlnJe3B5Trle1tA"} className={`w-5/6 h-5/6 ${styles.game}`}
                                   onMove={() => 1}
                                   validateMoves={true} isReadOnly={true} allowMoves={false} orientation={'white'}/>
                    </Link>
                </div>
            </div>
        </>
    )
}
