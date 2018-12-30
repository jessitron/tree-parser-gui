import React from 'react';

export class CodeDisplay extends React.Component<{
    dataToParse: {
        code: string,
        parserChoice: string
    }
}, {}> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <pre>
                    <code className={`lang-java`}>
                        {this.props.dataToParse && this.props.dataToParse.code || "Error: no code to display"}
                    </code>
                </pre>
            </div>
        );
    }
}