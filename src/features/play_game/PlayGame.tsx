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
import {Loader} from "../../components/Loader/Loader";
import {Button} from "../../components/Button/Button";
import {motion} from "framer-motion"

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
        return <><Loader size="small"/> loading</>;
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

    // game has open slots
    let waitingForPlayers = (game.playerBlack === undefined || game.playerWhite === undefined);

    // game has open slots and user is logged in
    let canJoin = (auth.currentUser !== undefined) && waitingForPlayers && !isInGame;

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
        <motion.div className={styles.container} layout>
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
                {waitingForPlayers ? (
                    <div className="absolute h-full w-full flex items-center justify-center z-10">
                        <div className="px-8 py-6 bg-white border-solid border border-blue-400 rounded shadow-md">
                            <h3 className="text-lg font-bold animate-bounce">Waiting for Players</h3>
                            {canJoin ? (
                                <div className={`mx-auto mt-2 text-center ${!canJoin ? "disabled" : ""}`}>
                                    <Button onClick={() => dispatch(joinGameAsync(game.id))}>Join Now</Button>
                                </div>
                            ) : null}
                        </div>
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
        </motion.div>
    );
}

export function PlayGameRoute() {
    let {id} = useParams<Record<string, string>>();
    return (
        <PlayGame game_id={id}/>
    )
}
