import React, {Component, RefObject} from "react";
import './chessground.css'
import './theme.css'
import {Chessground} from "chessground";
import {Api} from "chessground/api";
import {Config} from "chessground/config";
import {ChessMove} from "../../data/resource/games";

type ChessgroundWrapperProps = {
    /**
     * If onMove is not set, the board is treated as view only
     */
    onMove?: (orig: string, dest: string, promotion: string) => void;

    className?: string;

    config: Config
}

export class ChessgroundWrapper extends Component<ChessgroundWrapperProps, {}> {
    chessground?: Api;
    rootRef: RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this.rootRef = React.createRef();
    }

    componentDidMount() {
        this.chessground = Chessground(this.rootRef.current!, this.props.config);
        const old = this.chessground!.state.dom.bounds;

        // avoid chessground's memoization of bounds, as elements may render which shift the position of the board
        const f = () => {
            old.clear();
            return old();
        };

        f.clear = old.clear;

        this.chessground!.state.dom.bounds = f;
    }

    componentDidUpdate() {
        this.chessground?.set(this.props.config);
    }

    componentWillUnmount() {
        this.chessground?.destroy();
    }

    makeMove(move: ChessMove) {
        this.chessground?.move(move.source, move.end);
    }

    render() {
        return (
            <div ref={this.rootRef} className={this.props.className || ''}/>
        );
    }
}
