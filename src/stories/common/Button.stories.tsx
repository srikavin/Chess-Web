import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';
import {Loader} from "../../components/Loader/Loader";
import {Button, ButtonProps} from "../../components/Button/Button";

export default {
    title: 'Chess/Common/Button',
    component: Loader,
    argTypes: {onClick: {action: 'clicked'}}
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args}>Button</Button>;

export const Default = Template.bind({});
Default.args = {
    minimal: true,
}
