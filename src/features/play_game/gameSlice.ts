import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk, RootState} from '../../app/store';
import {
    ChessClock,
    ChessMove,
    ChessPosition,
    Game,
    GameApi,
    GameIdentifier,
    GameStatus
} from "../../data/resource/games";
import {chessClockSync, chessJoinEvent, chessMoveEvent} from "../../data/resource/gameActions";
import {websocketConnect} from "../../data/websocket";
import {UserIdentifier} from "../../data/resource/users";
import {ChessInstance, PieceType} from "chess.js";
import {Key} from "chessground/types";

const Chess = require('chess.js')

interface GameState {
    gamesById: Record<string, Game>
    clocksById: Record<string, ChessClock>
    isLoading: boolean;
    error: string | null;
    subscribed: Array<GameIdentifier>;
}

const initialState: GameState = {
    gamesById: {},
    clocksById: {},
    isLoading: false,
    error: null,
    subscribed: []
};

const startLoading = (state: GameState) => {
    state.isLoading = true;
}

const requestError = (state: GameState, action: PayloadAction<string>) => {
    state.isLoading = false
    state.error = action.payload;
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        getGameStart: startLoading,
        getGameFailure: requestError,
        getGameSuccess: (state, {payload}: PayloadAction<Game>) => {
            state.gamesById[payload.id] = payload;
            state.isLoading = false
            state.error = null;
        },
        getGamesSuccess: (state, {payload}: PayloadAction<Game[]>) => {
            payload.forEach(e => {
                state.gamesById[e.id] = e;
            })
            state.isLoading = false
            state.error = null;
        },
        subscribeGameConfirm: (state, {payload}: PayloadAction<GameIdentifier>) => {
            state.subscribed.push(payload);
        },
        subscribeGame: (state, {payload}: PayloadAction<GameIdentifier>) => {
            GameApi.subscribeGame(payload)
            state.subscribed.push(payload);
        },
        endSubscribeGame: (state, {payload}: PayloadAction<GameIdentifier>) => {
            GameApi.endSubscribeGame(payload)
            state.subscribed = state.subscribed.filter(e => e !== payload);
        },
        makeMoveLocal: (state, {payload}: PayloadAction<{ id: string, move: ChessMove }>) => {
            const chess: ChessInstance = new Chess();

            const game = state.gamesById[payload.id];
            if (game.moves) {
                chess.load(game.currentFen);
                if (chess.move({to: payload.move.end, from: payload.move.source, promotion: payload.move.promotion})) {
                    game.currentFen = chess.fen();

                    if (game.status === GameStatus.IN_PROGRESS_BLACK) {
                        game.status = GameStatus.IN_PROGRESS_WHITE;
                    } else if (game.status === GameStatus.IN_PROGRESS_WHITE) {
                        game.status = GameStatus.IN_PROGRESS_BLACK;
                    }

                    game.moves.push(payload.move);
                }
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(chessMoveEvent, (state, {payload}) => {
            state.gamesById[payload.state.id] = payload.state;
        });
        builder.addCase(websocketConnect, state => {
            state.subscribed.forEach(e => {
                GameApi.subscribeGame(e)
            })
        });
        builder.addCase(chessJoinEvent, (state, {payload}) => {
            state.gamesById[payload.state.id] = payload.state;
        });
        builder.addCase(chessClockSync, (state, {payload}) => {
            console.log(state, payload)
            state.clocksById[payload.game_id] = payload.clock;
        });
    }
});

export const {getGameStart, getGameFailure, getGameSuccess, subscribeGame, endSubscribeGame, getGamesSuccess, makeMoveLocal} = gameSlice.actions;

export const getGameAsync = (id: string): AppThunk => async dispatch => {
    GameApi.getGameById(id).then(e => dispatch(getGameSuccess(e)));
};

export const getRecentGamesAsync = (): AppThunk => async dispatch => {
    GameApi.getRecentGames().then(e => dispatch(getGamesSuccess(e)));
};

export const getRecentGamesForUserAsync = (userId: UserIdentifier): AppThunk => async (dispatch, getState) => {
    GameApi.getRecentGames(undefined, userId).then(e => dispatch(getGamesSuccess(e)));
};

export const joinGameAsync = (game_id: GameIdentifier): AppThunk => async dispatch => {
    await GameApi.joinGame(game_id);
};

export const makeMoveAsync = (id: string, from: ChessPosition, to: ChessPosition, promotion: Exclude<PieceType, 'p'>): AppThunk => async dispatch => {
    dispatch(makeMoveLocal({id, move: {source: from, end: to, promotion}}));
    await GameApi.makeMove(id, {source: from, end: to, promotion: promotion});
};

export const requestClockSync = (id: string): AppThunk => async dispatch => {
    await GameApi.syncClock(id);
};

export const selectGame = (state: RootState) => state.game;

export const selectValidMoves = createSelector([selectGame], (state: GameState) => {
    const chess: ChessInstance = new Chess();
    const ret: Record<string, Map<Key, Key[]>> = {};

    Object.entries(state.gamesById).forEach(([id, game]) => {
        if (!game.moves) {
            return;
        }

        const curMoves: Map<Key, Key[]> = new Map();

        chess.load(game.currentFen);

        chess.moves({verbose: true}).forEach((e) => {
            const arr = curMoves.get(e.from) || [];
            curMoves.set(e.from, arr.concat(e.to));
        });

        ret[id] = curMoves;
    });

    return ret;
});

export default gameSlice.reducer;