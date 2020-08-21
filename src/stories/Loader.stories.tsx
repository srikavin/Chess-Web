import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';
import {Loader, LoaderProps} from "../components/Loader/Loader";

export default {
    title: 'Chess/Common/Loader',
    component: Loader,
} as Meta;

const Template: Story<LoaderProps> = (args) => <Loader {...args} />;

export const Small = Template.bind({});
Small.args = {
    size: 'small'
}

export const Medium = Template.bind({});
Medium.args = {
    size: 'medium'
}

export const Large = Template.bind({});
Large.args = {
    size: 'large'
}