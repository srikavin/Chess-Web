import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {getRecentGamesAsync} from "../play_game/gameSlice";
import {Link} from "react-router-dom";
import {GameBoard} from "./GameBoard";
import {Game} from "../../data/resource/games";

import styles from './RecentGames.module.css'

interface GamePreviewProps {
    game: Game;
}

export function GamePreview(props: GamePreviewProps) {
    const game = props.game;

    return (
        <>
            <Link to={`/games/${game.id}`}>
                <GameBoard game_id={game.id} className={styles.previewBoard} validateMoves={false}/>
            </Link>
        </>
    )
}

export function RecentGames() {
    const dispatch = useDispatch();
    const games = useSelector((state: RootState) => state.game);

    useEffect(() => {
        dispatch(getRecentGamesAsync());
    }, [dispatch]);

    const loaded = games.gamesById;

    const temp = [];

    for (const g in loaded) {
        if (loaded.hasOwnProperty(g)) {
            temp.push(loaded[g]);
        }
    }

    return (
        <>
            {
                temp.map(e => {
                    return <GamePreview game={e}/>
                })
            }
        </>
    );
}