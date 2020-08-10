import {useParams} from "react-router-dom";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getGameAsync, makeMoveAsync} from "./gameSlice";
import styles from './PlayGame.module.css';
import {RootState} from "../../app/store";
import {UserPreview} from "../user_profile/UserPreview";
import {GameBoard} from "../game/GameBoard";

export function PlayGame(props: { game_id: string }) {
    const dispatch = useDispatch();
    const game = useSelector((state: RootState) => state.game.gamesById[props.game_id]);

    useEffect(() => {
        if (game === undefined) {
            dispatch(getGameAsync(props.game_id));
        }
    }, [dispatch, props.game_id, game]);

    if (!game) {
        return <>loading</>;
    }

    return (
        <div className={styles.container}>
            <UserPreview user_id={game.playerWhite} className={styles.preview}/>
            <GameBoard game_id={game.id} className={styles.chessground}
                       onMove={(orig, dest, promotion) => dispatch(makeMoveAsync(props.game_id, orig, dest))}
                       validateMoves={true}/>
            <UserPreview user_id={game.playerBlack} className={styles.preview}/>
        </div>
    );
}

export function PlayGameRoute() {
    let {id} = useParams();
    return (
        <PlayGame game_id={id}/>
    )
}