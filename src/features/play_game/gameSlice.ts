import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk, RootState} from '../../app/store';
import {ChessPosition, Game, GameApi, GameIdentifier} from "../../data/resource/games";
import {chessMoveEvent} from "../../data/resource/gameActions";
import {websocketConnect} from "../../data/websocket";
import {UserIdentifier} from "../../data/resource/users";


interface GameState {
    gamesById: Record<string, Game>
    isLoading: boolean;
    error: string | null;
    subscribed: Array<GameIdentifier>;
}

const initialState: GameState = {
    gamesById: {},
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
        })
    }
});

export const {getGameStart, getGameFailure, getGameSuccess, subscribeGame, endSubscribeGame, getGamesSuccess} = gameSlice.actions;

export const getGameAsync = (id: string): AppThunk => async dispatch => {
    GameApi.getGameById(id).then(e => dispatch(getGameSuccess(e)));
};

export const getRecentGamesAsync = (): AppThunk => async dispatch => {
    GameApi.getRecentGames().then(e => dispatch(getGamesSuccess(e)));
};

export const getRecentGamesForUserAsync = (userId: UserIdentifier): AppThunk => async dispatch => {
    GameApi.getRecentGames(undefined, userId).then(e => dispatch(getGamesSuccess(e)));
};

export const joinGameAsync = (game_id: GameIdentifier): AppThunk => async dispatch => {
    await GameApi.joinGame(game_id);
};

export const makeMoveAsync = (id: string, from: ChessPosition, to: ChessPosition): AppThunk => async dispatch => {
    await GameApi.makeMove(id, {source: from, end: to});
};

export const selectGame = (state: RootState) => state.game;

export default gameSlice.reducer;