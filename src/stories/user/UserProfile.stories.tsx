import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';
import {PureUserProfile, PureUserProfileProps} from "../../features/user_profile/UserProfile";

export default {
    title: 'Chess/User/UserProfile',
    component: PureUserProfile,
} as Meta;

const Template: Story<PureUserProfileProps> = (args) => <PureUserProfile {...args} />;

export const Default = Template.bind({});
Default.args = {
    loading: false,
    user: {
        username: 'username',
        id: 'yl2gzpDS5NN5Jj6G',
        bio: 'Example Bio.',
        profilePicUrl: 'https://chess-glade-dev.herokuapp.com/api/v1/users/yl2gzpDS5NN5Jj6G/preview',
        lastSeen: new Date()
    }
};

export const Loading = Template.bind({});
Loading.args = {
    loading: true
}
