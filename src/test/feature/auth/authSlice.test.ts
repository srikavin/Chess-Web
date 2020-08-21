import {UserApi as _userapi} from "../../../data/resource/users";
import {mocked} from "ts-jest/utils";
import authReducer, {
    authFailure,
    authStart,
    authSuccess,
    loginAsync,
    registerAsync,
    UserProfileState
} from "../../../features/auth/authSlice";

const MockUserApi = mocked(_userapi, true);

jest.mock('../../../data/resource/users');

describe('loginThunk', () => {
    it('should dispatch a authSuccess on success', async () => {
        MockUserApi.login.mockResolvedValue({userId: 'testUserId', token: 'testToken'})

        const dispatch = jest.fn();
        const getState = jest.fn();

        await loginAsync('testUsername', 'testPassword')(dispatch, getState, undefined);

        expect(dispatch).toHaveBeenNthCalledWith(1, authStart());
        expect(dispatch).toHaveBeenNthCalledWith(2, authSuccess({userId: 'testUserId', token: 'testToken'}));
    });

    it('should dispatch a authFailure on failure', async () => {
        MockUserApi.login.mockRejectedValue('request error')

        const dispatch = jest.fn();
        const getState = jest.fn();

        await loginAsync('testUsername', 'testPassword')(dispatch, getState, undefined);

        expect(dispatch).toHaveBeenNthCalledWith(1, authStart());
        expect(dispatch).toHaveBeenNthCalledWith(2, authFailure('request error'));
    });
});

describe('registerThunk', () => {
    it('should dispatch a authSuccess on success', async () => {
        MockUserApi.register.mockResolvedValue({userId: 'testUserId', token: 'testToken'})

        const dispatch = jest.fn();
        const getState = jest.fn();

        await registerAsync('testUsername', 'testPassword')(dispatch, getState, undefined);

        expect(dispatch).toHaveBeenNthCalledWith(1, authStart());
        expect(dispatch).toHaveBeenNthCalledWith(2, authSuccess({userId: 'testUserId', token: 'testToken'}));
    });

    it('should dispatch a authFailure on failure', async () => {
        MockUserApi.register.mockRejectedValue('request error')

        const dispatch = jest.fn();
        const getState = jest.fn();

        await registerAsync('testUsername', 'testPassword')(dispatch, getState, undefined);

        expect(dispatch).toHaveBeenNthCalledWith(1, authStart());
        expect(dispatch).toHaveBeenNthCalledWith(2, authFailure('request error'));
    });
});

describe('authReducer', () => {
    const defaultState: () => UserProfileState = () => {
        return {
            error: undefined,
            isLoading: false,
            currentUser: undefined,
            token: undefined
        }
    }

    it('should handle authStart', function () {
        expect(authReducer(defaultState(), authStart())).toEqual({
            ...defaultState(),
            isLoading: true
        });
    });

    it('should handle authFailure', function () {
        expect(authReducer({...defaultState(), isLoading: true}, authFailure('test error string'))).toEqual({
            ...defaultState(),
            isLoading: false,
            error: 'test error string'
        });
    });

    it('should handle authSuccess', function () {
        expect(authReducer({...defaultState(), isLoading: true}, authSuccess({
            userId: 'testUserId',
            token: 'testAuthToken'
        }))).toEqual({
            ...defaultState(),
            isLoading: false,
            currentUser: 'testUserId',
            token: 'testAuthToken'
        });
    });
});