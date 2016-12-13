var StarredRepoList = React.createClass({
    getInitialState: function(){
        return { data: []};
    },
    loadReposFromServer: function(){
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
        this.loadReposFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    handleUnstarRequest: function(repoOwner, repoName){
        var data = this.state.data;
        $.ajax({
            url: this.props.url + "/" + repoOwner + "/" + repoName,
            dataType: 'json',
            type: 'DELETE',
            success: function(data){
                console.log(repoOwner + "/" + repoName + " unstarred!");
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function(){
        return (
            <div className="commentBox">    
                <h1 className="Head">Repositories</h1>
                <RepoList  onUnstarRequest={this.handleUnstarRequest }data={this.state.data} />
            </div>
        );
    }
})

var RepoList = React.createClass({
    render: function(){
        var RepoNodes = this.props.data.map(function(repo){
            return(
                <Repo key={repo.id} id={repo.id} data={repo}
                onUnstarRepo={this.props.onUnstarRequest}
                owner={repo.owner.login}
                name={repo.name} >
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
    UnstarRepo: function(){
        this.props.onUnstarRepo(this.props.owner, this.props.name);
    },
    render: function(){
        return(
            <div className="container first_link">
                <div className="row">
                    <div className="col-md-10">
                    <a href="#">
                        <h3 className="reponame">
                        {this.props.data.owner.login} / {this.props.data.name}
                        </h3>
                    </a>
                    </div>
                    <div className="col-md-2">
                        <button onClick={this.UnstarRepo}>X</button>
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