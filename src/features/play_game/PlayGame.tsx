import {useParams} from "react-router-dom";
import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getGameAsync, joinGameAsync, makeMoveAsync} from "./gameSlice";
import styles from './PlayGame.module.css';
import {RootState} from "../../app/store";
import {UserPreview} from "../user_profile/UserPreview";
import {GameBoard} from "../game/GameBoard";
import {selectAuth} from "../auth/authSlice";
import {GameStatus} from "../../data/resource/games";

export function PlayGame(props: { game_id: string }) {
    const dispatch = useDispatch();
    const game = useSelector((state: RootState) => state.game.gamesById[props.game_id]);
    const auth = useSelector(selectAuth);

    useEffect(() => {
        if (!game?.moves) {
            dispatch(getGameAsync(props.game_id));
        }
    }, [dispatch, props.game_id, game]);

    const onMoveCallback = useCallback((orig, dest, promotion) => {
        dispatch(makeMoveAsync(props.game_id, orig, dest));
    }, [dispatch, props.game_id])

    if (!game) {
        return <>loading</>;
    }

    const isInGame = auth.currentUser !== undefined && (auth.currentUser === game.playerWhite || auth.currentUser === game.playerBlack)

    const isAuthorized = auth.currentUser !== undefined
        && ((auth.currentUser === game.playerWhite && game.status === GameStatus.IN_PROGRESS_WHITE)
            || (auth.currentUser === game.playerBlack && game.status === GameStatus.IN_PROGRESS_BLACK));

    let onMove: any = onMoveCallback;

    if (isInGame && !isAuthorized) {
        // initialize game with empty on move callback
        onMove = () => {
        };
    } else if (!isAuthorized) {
        // current user is not authorized to make moves in this game
        onMove = undefined;
    }

    let canJoin = false;
    if ((auth.currentUser !== undefined) && (game.playerBlack === undefined || game.playerWhite === undefined)) {
        // game has open slots and user is logged in
        canJoin = true;
    }

    console.log(auth.currentUser, game.playerWhite, game.playerBlack)

    return (
        <div className={styles.container}>
            <div className={styles.game}>
                <UserPreview user_id={game.playerBlack} className={styles.preview}/>
                <GameBoard game_id={game.id} className={styles.chessground} onMove={onMove} validateMoves={true}
                           isReadOnly={false}/>
                <UserPreview user_id={game.playerWhite} className={styles.preview}/>
            </div>
            <div className={styles.moves}>
                {
                    game?.moves?.map((move) => (
                            <>{move.source} -> {move.end}<br/></>
                        )
                    )
                }

                {canJoin ? (
                    <button onClick={() => dispatch(joinGameAsync(game.id))}>Join</button>
                ) : null}
            </div>
        </div>
    );
}

export function PlayGameRoute() {
    let {id} = useParams();
    return (
        <PlayGame game_id={id}/>
    )
}