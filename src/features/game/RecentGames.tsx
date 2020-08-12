import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {getRecentGamesAsync, getRecentGamesForUserAsync} from "../play_game/gameSlice";
import {Link} from "react-router-dom";
import {GameBoard} from "./GameBoard";
import {Game} from "../../data/resource/games";

import styles from './RecentGames.module.css'
import {UserIdentifier} from "../../data/resource/users";

interface GamePreviewProps {
    game: Game;
}

export function GamePreview(props: GamePreviewProps) {
    const game = props.game;

    return (
        <>
            <Link to={`/games/${game.id}`}>
                <GameBoard game_id={game.id} className={styles.previewBoard} validateMoves={false} isReadOnly={true}/>
            </Link>
        </>
    )
}

interface RecentGamesProps {
    userId?: UserIdentifier;
}

export function RecentGames(props: RecentGamesProps) {
    const dispatch = useDispatch();
    const games = useSelector((state: RootState) => state.game);

    useEffect(() => {
        if (props.userId) {
            dispatch(getRecentGamesForUserAsync(props.userId));
        } else {
            dispatch(getRecentGamesAsync());
        }
    }, [dispatch, props.userId]);

    const loaded = games.gamesById;

    const temp = [];

    for (const g in loaded) {
        if (loaded.hasOwnProperty(g)) {
            if (props.userId && loaded[g].playerBlack !== props.userId && loaded[g].playerWhite !== props.userId) {
                continue;
            }
            temp.push(loaded[g]);
        }
    }

    return (
        <>
            {
                temp.map(e => {
                    return <GamePreview key={e.id} game={e}/>
                })
            }
        </>
    );
}