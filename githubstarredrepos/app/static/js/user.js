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
                <h1>Repositories</h1>
                <RepoList  data={this.state.data} />
            </div>
        );
    }
})

var RepoList = React.createClass({
    render: function(){
        var RepoNodes = this.props.data.map(function(repo){
            return(
                <Repo key={repo.id} id={repo.id} data={repo}>
                    {repo.name}
                </Repo>
                );
        }.bind(this));
        return(
            <div className="commentlist">
                {RepoNodes}
            </div>
        );
    }
});


var Repo = React.createClass({
    render: function(){
        return(
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.data.owner.login}
                </h2>
                <button>X</button>
            </div>
        )
    }
});

ReactDOM.render(
    < StarredRepoList url="/api/starred" pollInterval={4000} />,
    document.getElementById('App')
);  