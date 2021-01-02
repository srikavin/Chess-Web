import React, {Component, RefObject} from "react";
import './chessground.css'
import './theme.css'
import {Chessground} from "chessground";
import {Api} from "chessground/api";
import {Config} from "chessground/config";

export type ChessgroundWrapperProps = {
    className?: string;

    config: Config
}

export class ChessgroundWrapper extends Component<ChessgroundWrapperProps, { interval?: any }> {
    chessground?: Api;
    rootRef: RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this.rootRef = React.createRef();
        this.state = {};
    }

    componentDidMount() {
        this.chessground = Chessground(this.rootRef.current!, this.props.config);

        // TODO: Find a proper way to update the bounds
        this.setState({
            interval: setInterval(() => {
                if (this.chessground) {
                    this.chessground?.redrawAll();
                }
            }, 500)
        });
    }

    componentDidUpdate() {
        this.chessground?.set(this.props.config);
    }

    componentWillUnmount() {
        this.chessground?.destroy();
        clearTimeout(this.state.interval);
    }

    render() {
        return (
            <div ref={this.rootRef} className={this.props.className || 'cgwrapper-container'}/>
        );
    }
}
