import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk, RootState} from '../../app/store';
import {AuthResponse, UserApi} from "../../data/resource/users";
import {Identifier} from "../../data/identifier";
import {AuthService} from "../../data/auth";

export interface UserProfileState {
    currentUser: Identifier | undefined;
    token: string | undefined;
    error: string | undefined;
    isLoading: boolean;
}

const [token, currentUser] = AuthService.getToken();
const initialState: UserProfileState = {
    currentUser: currentUser,
    token: token,
    error: undefined,
    isLoading: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authStart: (state: UserProfileState) => {
            state.isLoading = true;
            state.error = undefined;
        },
        authFailure: (state: UserProfileState, action: PayloadAction<string | undefined>) => {
            state.isLoading = false
            state.error = action.payload;
        }
        ,
        authSuccess: (state, {payload}: PayloadAction<AuthResponse>) => {
            state.token = payload.token;
            state.currentUser = payload.userId;
            state.isLoading = false
            state.error = undefined;
        }
    },
});

export const {authFailure, authStart, authSuccess} = authSlice.actions;

export const registerAsync = (username: string, password: string): AppThunk => async dispatch => {
    dispatch(authStart());
    await UserApi.register(username, password)
        .then(response => dispatch(authSuccess(response)))
        .catch((error: Error) => dispatch(authFailure(error.message)));
};


export const loginAsync = (username: string, password: string): AppThunk => async dispatch => {
    dispatch(authStart());
    await UserApi.login(username, password)
        .then(response => dispatch(authSuccess(response)))
        .catch((error: Error) => dispatch(authFailure(error.message)));
};

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
