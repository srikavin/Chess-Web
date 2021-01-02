import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {PureUserPreview, PureUserPreviewProps} from "../../features/user_profile/UserPreview";

export default {
    title: 'Chess/User/PureUserPreview',
    component: PureUserPreview,
} as Meta;

const Template: Story<PureUserPreviewProps> = (args) => <PureUserPreview {...args} />;

export const Default = Template.bind({});
Default.args = {
    username: 'username',
    user_id: 'yl2gzpDS5NN5Jj6G',
    loading: false,
    bio: 'Example Bio.',
    className: '',
    profilePicUrl: 'https://chess-glade-dev.herokuapp.com/api/v1/users/yl2gzpDS5NN5Jj6G/preview'
};

export const Loading = Template.bind({});
Loading.args = {
    loading: true
}