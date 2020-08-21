import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';
import {ChessgroundWrapper, ChessgroundWrapperProps} from "../features/game/ChessgroundWrapper";

export default {
    title: 'Chess/Game/ChessgroundWrapper',
} as Meta;

const Template: Story<ChessgroundWrapperProps> = (args) => <ChessgroundWrapper {...args}/>;

export const Default = Template.bind({});
