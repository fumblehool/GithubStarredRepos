var StarredRepoList = React.createClass({
    getInitialState: function(){
        return { data: []};
    },
    loadCommentsFromServer: function(){
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data){
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)

        });
    },
    componentDidMount: function(){
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function(){
        return (
            <div className="commentBox">    
                <h1>Repos</h1>
                <List  data={this.state.data} />
            </div>
        );
    }
})

var List = React.createClass({
    render: function(){
        return(
            <div className="commentlist">
                {this.props.data.map(function(comment){
                    return <h1> {comment.name} </h1>;
                    }) }
            </div>
        );
    }
});

ReactDOM.render(
    < StarredRepoList url="/api/starred" pollInterval={2000} />,
    document.getElementById('App')
);  