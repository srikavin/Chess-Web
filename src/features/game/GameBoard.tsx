import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";

import {ChessInstance} from "chess.js";
import {Key} from "chessground/types";
import {endSubscribeGame, getGameAsync, selectGame, subscribeGame} from "../play_game/gameSlice";
import {ChessgroundWrapper} from "./ChessgroundWrapper";
import {ChessPosition} from "../../data/resource/games";
import {Config} from "chessground/config";

const Chess = require('chess.js')

type GameBoardProps = {
    game_id: string;

    onMove?: (orig: ChessPosition, dest: ChessPosition, promotion: string) => void;

    className?: string;

    validateMoves: boolean;

    isReadOnly: boolean;
}

const defaultProps: Partial<GameBoardProps> = {
    validateMoves: true
}

export function GameBoard(props: GameBoardProps) {
    const dispatch = useDispatch();
    const game = useSelector((state: RootState) => state.game.gamesById[props.game_id]);
    const state = useSelector(selectGame);

    const isReadOnly = props.isReadOnly;

    const chessRef = useRef<ChessInstance>(new Chess());

    const [possibleMoves, setPossibleMoves] = useState(new Map<Key, Key[]>());

    const chess = chessRef.current;

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
            return
        }

        if (isReadOnly) {
            return;
        }

        if (chess.fen() !== game.currentFen) {
            console.log(chess.fen(), game.currentFen)
            chess.load(game.currentFen);
        }


        const curMoves: Map<Key, Key[]> = new Map();

        chess.moves({verbose: true}).forEach((e) => {
            const arr = curMoves.get(e.from) || [];
            curMoves.set(e.from, arr.concat(e.to));
        });

        setPossibleMoves(curMoves);
    }, [state.isLoading, game, chess, dispatch, props.game_id, isReadOnly, setPossibleMoves])

    const config: Config = {
        fen: game?.currentFen ? game.currentFen : '8/8/8/8/8/8/8/8',
        resizable: true,
        viewOnly: isReadOnly,
        movable: {
            free: false,
            showDests: true,
            dests: possibleMoves
        },
    }

    if (!isReadOnly) {
        config.events = {
            move: (orig, dest) => {
                chess.move({from: orig as ChessPosition, to: dest as ChessPosition})
                console.log(chess.pgn())
                props.onMove!(orig as ChessPosition, dest as ChessPosition, '');
            }
        }
    }
    config.movable!.dests = possibleMoves;

    console.log(config.movable)

    return (
        <>
            <ChessgroundWrapper config={config} className={props.className}/>
            <br/>
        </>
    );
}

GameBoard.defaultProps = defaultProps;