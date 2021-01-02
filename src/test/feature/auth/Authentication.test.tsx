import React, {ReactElement} from 'react';
import {Provider} from 'react-redux';

import {AuthenticationCommon, LoginRoute, RegisterRoute} from "../../../features/auth/Authentication";
import configureMockStore from 'redux-mock-store'
import * as _authSlice from '../../../features/auth/authSlice';
import {UserProfileState} from '../../../features/auth/authSlice';
import thunk from 'redux-thunk'
import {mocked} from "ts-jest/utils";
import {render} from "@testing-library/react";
import userEvent from '@testing-library/user-event'

const mockedAuthSlice = mocked(_authSlice, true);

const getMockStore = (initialState: UserProfileState = {
    isLoading: false,
    token: undefined,
    currentUser: undefined,
    error: undefined
}) => {
    return configureMockStore([thunk])({
        auth: {initialState}
    });
}

const getWrapper = (Component: ReactElement, mockStore = getMockStore()) => render(
    <Provider store={mockStore}>
        {Component}
    </Provider>
);

describe('<LoginRoute />', () => {
    it('should dispatch the correct action', async () => {
        const mockStore = getMockStore();
        const loginAsyncRet = {
            type: 'test/loginAsyncCalled'
        };

        mockedAuthSlice.loginAsync = jest.fn().mockReturnValue(loginAsyncRet);

        const component = getWrapper(<LoginRoute/>, mockStore);

        await userEvent.type(component.getByLabelText(/username/i), "testUsername");
        await userEvent.type(component.getByLabelText(/password/i), "testPassword");

        userEvent.click(component.getByRole('button'));

        expect(mockedAuthSlice.loginAsync).toHaveBeenCalledTimes(1);
        expect(mockedAuthSlice.loginAsync).toHaveBeenCalledWith('testUsername', 'testPassword');

        expect(mockStore.getActions()).toContain(loginAsyncRet);
    });
});

describe('<RegisterRoute />', () => {
    it('should dispatch the correct action', async () => {
        const mockStore = getMockStore();
        const registerAsyncRet = {
            type: 'test/registerAsyncCalled'
        };

        mockedAuthSlice.registerAsync = jest.fn().mockReturnValue(registerAsyncRet);

        const component = getWrapper(<RegisterRoute/>, mockStore);

        await userEvent.type(component.getByLabelText(/username/i), "testUsername2");
        await userEvent.type(component.getByLabelText(/password/i), "testPassword2");

        userEvent.click(component.getByRole('button'));

        expect(mockedAuthSlice.registerAsync).toHaveBeenCalledTimes(1);
        expect(mockedAuthSlice.registerAsync).toHaveBeenCalledWith('testUsername2', 'testPassword2');

        expect(mockStore.getActions()).toContain(registerAsyncRet);
    });
});

describe('<AuthenticationCommon />', () => {
    it('should call the callback with the correct values', async () => {
        const onSubmitCallback = jest.fn();

        const component = render(<AuthenticationCommon type={'Test Login'} error={''} onSubmit={onSubmitCallback}
                                                       loading={false}/>)

        userEvent.click(component.getByRole('button'));

        expect(onSubmitCallback).toHaveBeenCalledTimes(1);
        expect(onSubmitCallback).toHaveBeenNthCalledWith(1, '', '');

        await userEvent.type(component.getByLabelText(/username/i), "testUsername");
        await userEvent.type(component.getByLabelText(/password/i), "testPassword");

        userEvent.click(component.getByRole('button'));

        expect(onSubmitCallback).toHaveBeenCalledTimes(2);
        expect(onSubmitCallback).toHaveBeenNthCalledWith(2, 'testUsername', 'testPassword');
    });
});
