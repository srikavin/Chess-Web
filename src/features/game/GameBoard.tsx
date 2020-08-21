import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {endSubscribeGame, getGameAsync, selectGame, selectValidMoves, subscribeGame} from "../play_game/gameSlice";
import {ChessgroundWrapper} from "./ChessgroundWrapper";
import {ChessPosition} from "../../data/resource/games";
import {Config} from "chessground/config";

export type GameBoardProps = {
    game_id: string;

    onMove?: (orig: ChessPosition, dest: ChessPosition, promotion: string) => void;

    className?: string;

    validateMoves: boolean;

    isReadOnly: boolean;

    allowMoves: boolean;

    orientation: 'white' | 'black';
}

const defaultProps: Partial<GameBoardProps> = {
    validateMoves: true
}

export function GameBoard(props: GameBoardProps) {
    const dispatch = useDispatch();
    const game = useSelector((state: RootState) => state.game.gamesById[props.game_id]);
    const state = useSelector(selectGame);

    const isReadOnly = props.isReadOnly;

    const possibleMoves = useSelector(selectValidMoves)[props.game_id];

    useEffect(() => {
        dispatch(subscribeGame(props.game_id));
        return () => {
            dispatch(endSubscribeGame(props.game_id));
        }
    }, [props.game_id, dispatch])

    useEffect(() => {
        if (state.isLoading) {
            return;
        }

        if (!game) {
            dispatch(getGameAsync(props.game_id));
        }
    }, [state.isLoading, game, dispatch, props.game_id])

    const config: Config = {
        fen: game?.currentFen ? game.currentFen : '8/8/8/8/8/8/8/8',
        resizable: true,
        viewOnly: isReadOnly,
        movable: {
            free: false,
            showDests: true,
            dests: possibleMoves
        },
        orientation: props.orientation,
        draggable: {
            enabled: props.allowMoves
        }
    }

    if (!isReadOnly) {
        config.events = {
            move: (orig, dest) => {
                props.onMove!(orig as ChessPosition, dest as ChessPosition, '');
            }
        }
    }

    if (props.allowMoves) {
        config.movable!.dests = possibleMoves;
    } else {
        config.movable!.dests = undefined;
    }

    if (game.moves && game.moves.length >= 1) {
        const lastMove = game.moves[game.moves.length - 1];
        config.lastMove = [lastMove.source, lastMove.end];
    }

    console.log(config)

    return (
        <>
            <ChessgroundWrapper config={config} className={props.className}/>
            <br/>
        </>
    );
}

GameBoard.defaultProps = defaultProps;