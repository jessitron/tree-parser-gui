const React = require('react');
const EssayForm = require('./EssayForm');
/* the main page for the index route of this app */
class HelloWorld extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deps: []
        };
    }
    componentDidMount() {
        fetch('/dependencies')
            .then(response => response.json())
            .then(data => {
            console.log("here is the data");
            console.log(data);
            this.setState({
                deps: data
            });
        });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Parse My Code!"),
            React.createElement("p", null,
                "Working with @atomist/antlr version: ",
                this.state.deps["@atomist/antlr"]),
            React.createElement(EssayForm, null)));
    }
}
module.exports = HelloWorld;
