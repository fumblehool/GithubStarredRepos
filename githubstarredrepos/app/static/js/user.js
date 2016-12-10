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
            <div className="container first_link">
                <div className="row">
                    <div className="col-md-10">
                    <a href="#">
                        <h3>
                        {this.props.data.owner.login} / {this.props.data.name}
                        </h3>
                    </a>
                    </div>
                    <div className="col-md-2">
                        <button>X</button>
                    </div>
                </div>
                <div class="py-1">
                <p class="d-inline-block col-9 text-gray pr-4" itemprop="description">
                    {this.props.data.description}
                </p>
  </div>
                <hr/>
                
                
            </div>
        )
    }
});

ReactDOM.render(
    < StarredRepoList url="/api/starred" pollInterval={8000} />,
    document.getElementById('App')
);  