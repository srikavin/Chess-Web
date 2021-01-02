import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';
import {ChessgroundWrapperProps} from "../../features/game/ChessgroundWrapper";
import {Skeleton} from "../../components/Skeleton/Skeleton";

export default {
    title: 'Chess/Common/Skeleton',
    component: Skeleton,
} as Meta;

const Template: Story<ChessgroundWrapperProps> = (args) => <Skeleton {...args}>Test</Skeleton>;

export const Default = Template.bind({});
Default.args = {}
