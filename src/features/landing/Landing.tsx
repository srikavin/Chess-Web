import React from "react";
import {Button} from "../../components/Button/Button";
import {GameBoard} from "../game/GameBoard";
import {Link} from 'react-router-dom';
import styles from './Landing.module.css'
import {createAiGameAsync, createGameAsync} from "../play_game/gameSlice";
import {useDispatch} from "react-redux";

export function Landing() {
    const dispatch = useDispatch();

    return (
        <>
            <div className={`container mx-auto flex flex-row flex-wrap w-screen ${styles.hero}`}>
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
                        <Button onClick={() => dispatch(createGameAsync())}>Play against a friend</Button>
                        <Button onClick={() => dispatch(createAiGameAsync())}>Play against Stockfish</Button>
                    </Link>
                </div>

                <Link to={'/games/OvlnJe3B5Trle1tA'}>
                    <GameBoard game_id={"OvlnJe3B5Trle1tA"} className={styles.game}
                               validateMoves={true} isReadOnly={true} allowMoves={false} orientation={'white'}/>
                </Link>
            </div>
        </>
    )
}
