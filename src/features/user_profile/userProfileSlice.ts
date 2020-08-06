import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk, RootState} from '../../app/store';
import {User, UserApi} from "../../data/resource/users";

interface UserProfileState {
    usersById: Record<string, User>
    isLoading: boolean;
    error: string | null;
}

const initialState: UserProfileState = {
    usersById: {},
    isLoading: false,
    error: null
};

const startLoading = (state: UserProfileState) => {
    state.isLoading = true;
}

const requestError = (state: UserProfileState, action: PayloadAction<string>) => {
    state.isLoading = false
    state.error = action.payload;
}

export const userProfileSlice = createSlice({
    name: 'user_profile',
    initialState,
    reducers: {
        getUsersStart: startLoading,
        getUserStart: startLoading,
        getUsersFailure: requestError,
        getUserFailure: requestError,
        getUserSuccess: (state, {payload}: PayloadAction<User>) => {
            state.usersById[payload.id] = payload;
            state.isLoading = false
            state.error = null;
        }
    },
});

export const {getUserFailure, getUsersFailure, getUsersStart, getUserStart, getUserSuccess} = userProfileSlice.actions;

export const getUserAsync = (id: string): AppThunk => async dispatch => {
    UserApi.getUserById(id).then(e => dispatch(getUserSuccess(e)));
};

export const selectUserProfile = (state: RootState) => state.user_profile;

export default userProfileSlice.reducer;