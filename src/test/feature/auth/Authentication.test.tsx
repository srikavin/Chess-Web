import React, {ReactElement} from 'react';
import Enzyme, {mount} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {Provider} from 'react-redux';

import {AuthenticationCommon, LoginRoute, RegisterRoute} from "../../../features/auth/Authentication";
import configureMockStore from 'redux-mock-store'
import * as _authSlice from '../../../features/auth/authSlice';
import {UserProfileState} from '../../../features/auth/authSlice';
import thunk from 'redux-thunk'
import {mocked} from "ts-jest/utils";

Enzyme.configure({adapter: new EnzymeAdapter()});

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

const getWrapper = (Component: ReactElement, mockStore = getMockStore()) => mount(
    <Provider store={mockStore}>
        {Component}
    </Provider>
);

describe('<LoginRoute />', () => {
    it('should dispatch the correct action', () => {
        const mockStore = getMockStore();
        const loginAsyncRet = {
            type: 'test/loginAsyncCalled'
        };

        mockedAuthSlice.loginAsync = jest.fn().mockReturnValue(loginAsyncRet);

        const wrapper = getWrapper(<LoginRoute/>, mockStore);

        wrapper.find(AuthenticationCommon).props().onSubmit('testUsername', 'testPassword');

        expect(mockedAuthSlice.loginAsync).toHaveBeenCalledTimes(1);
        expect(mockedAuthSlice.loginAsync).toHaveBeenCalledWith('testUsername', 'testPassword');

        expect(mockStore.getActions()).toEqual([loginAsyncRet]);
    });
});

describe('<RegisterRoute />', () => {
    it('should dispatch the correct action', () => {
        const mockStore = getMockStore();
        const registerAsyncRet = {
            type: 'test/registerAsyncCalled'
        };

        mockedAuthSlice.registerAsync = jest.fn().mockReturnValue(registerAsyncRet);

        const wrapper = getWrapper(<RegisterRoute/>, mockStore);

        wrapper.find(AuthenticationCommon).props().onSubmit('testUsername', 'testPassword');

        expect(mockedAuthSlice.loginAsync).toHaveBeenCalledTimes(1);
        expect(mockedAuthSlice.loginAsync).toHaveBeenCalledWith('testUsername', 'testPassword');

        expect(mockStore.getActions()).toEqual([registerAsyncRet]);
    });
});

describe('<AuthenticationCommon />', () => {
    it('should call the callback with the correct values', () => {
        const onSubmitCallback = jest.fn();

        const component = mount(<AuthenticationCommon type={'Test Login'} error={''} onSubmit={onSubmitCallback}
                                                      loading={false}/>)

        expect(component.text()).toContain('Test Login');

        component.find('input[type="submit"]').simulate('click');

        expect(onSubmitCallback).toHaveBeenCalledTimes(1);
        expect(onSubmitCallback).toHaveBeenNthCalledWith(1, '', '');

        component.find('input[name="username"]').simulate('change', {target: {value: 'testUsername'}});
        component.find('input[name="password"]').simulate('change', {target: {value: 'testPassword'}});
        component.find('input[type="submit"]').simulate('click');

        expect(onSubmitCallback).toHaveBeenCalledTimes(2);
        expect(onSubmitCallback).toHaveBeenNthCalledWith(2, 'testUsername', 'testPassword');
    });
});