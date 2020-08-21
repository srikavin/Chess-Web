import {useParams} from "react-router-dom";
import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getGameAsync, joinGameAsync, makeMoveAsync, requestClockSync} from "./gameSlice";
import styles from './PlayGame.module.css';
import {RootState} from "../../app/store";
import {UserPreview} from "../user_profile/UserPreview";
import {GameBoard} from "../game/GameBoard";
import {selectAuth} from "../auth/authSlice";
import {GameStatus, PlayerColor} from "../../data/resource/games";
import {Clock} from "../game/ChessClock";

export function PlayGame(props: { game_id: string }) {
    const dispatch = useDispatch();
    const game = useSelector((state: RootState) => state.game.gamesById[props.game_id]);
    const auth = useSelector(selectAuth);
    const clock = useSelector((state: RootState) => state.game.clocksById[props.game_id]);

    useEffect(() => {
        if (!clock) {
            dispatch(requestClockSync(props.game_id));
        }
        if (!game?.moves) {
            dispatch(getGameAsync(props.game_id));
        }
    }, [dispatch, props.game_id, game, clock]);

    const onMoveCallback = useCallback((orig, dest, promotion) => {
        dispatch(makeMoveAsync(props.game_id, orig, dest, promotion));
    }, [dispatch, props.game_id])

    if (!game) {
        return <>loading</>;
    }

    const isInGame = auth.currentUser !== undefined && (auth.currentUser === game.playerWhite || auth.currentUser === game.playerBlack)

    const isAuthorized = auth.currentUser !== undefined
        && ((auth.currentUser === game.playerWhite && game.status === GameStatus.IN_PROGRESS_WHITE)
            || (auth.currentUser === game.playerBlack && game.status === GameStatus.IN_PROGRESS_BLACK));

    console.log(isAuthorized);

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

    const orientation = isInGame ? (auth.currentUser === game.playerWhite ? 'white' : 'black') : 'white';

    let clockOne;
    let clockTwo;
    let playerOne;
    let playerTwo;
    let colorOne;
    let colorTwo;

    if (orientation === 'white') {
        clockOne = clock?.whiteTimeLeft;
        clockTwo = clock?.blackTimeLeft;
        playerOne = game?.playerWhite;
        playerTwo = game?.playerBlack;
        colorOne = PlayerColor.WHITE;
        colorTwo = PlayerColor.BLACK;
    } else {
        clockOne = clock?.blackTimeLeft;
        clockTwo = clock?.whiteTimeLeft;
        playerOne = game?.playerBlack;
        playerTwo = game?.playerWhite;
        colorOne = PlayerColor.BLACK;
        colorTwo = PlayerColor.WHITE;
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.player} ${styles.playerOne}`}>
                <UserPreview user_id={playerTwo} className={styles.preview}/>
                <div className={styles.clock}>
                    {clock ? (
                        <Clock endTimeEpoch={clock.referenceTime + clockTwo}
                               isActive={clock.currentActive === colorTwo}/>
                    ) : null}
                </div>
            </div>
            <div className={styles.game}>
                {canJoin ? (
                    <div className={styles.game_overlay}>
                        <h2>Waiting for Players</h2>
                        <button onClick={() => dispatch(joinGameAsync(game.id))}>Join</button>
                    </div>
                ) : null}
                <GameBoard game_id={game.id} className={styles.chessground} onMove={onMove} validateMoves={true}
                           isReadOnly={false} allowMoves={isAuthorized} orientation={orientation}/>
            </div>
            <div className={`${styles.player} ${styles.playerTwo}`}>
                <UserPreview user_id={playerOne} className={styles.preview}/>
                <div className={styles.clock}>
                    {clock ? (
                        <Clock endTimeEpoch={clock.referenceTime + clockOne}
                               isActive={clock.currentActive === colorOne}/>
                    ) : null}
                </div>
            </div>

            <div className={styles.moves}>
                {game?.moves?.map((move, idx) => (
                        <div className={styles.move} key={idx}>
                            <span className={styles.move_start}>{move.source}</span>
                            <span className={styles.move_separator}>-</span>
                            <span className={styles.move_end}>{move.end}</span>
                        </div>
                    )
                )}
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