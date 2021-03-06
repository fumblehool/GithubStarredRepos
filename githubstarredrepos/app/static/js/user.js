var { Router,
      Route,
      IndexRoute,
      IndexLink,
      Link,
      hashHistory } = ReactRouter;

var NavigationBar = React.createClass({
    render: function(){
        
        return (
            <div className="container">
            <h1>Github Starred Repos</h1>
            <ul className="nav nav-tabs nav-justified">
                <li><IndexLink to="/">User</IndexLink></li>
                <li><Link to="/list">Repo List</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        )
    }
});

var SearchBar = React.createClass({
    doSearch:function(){
        var query=this.refs.searchInput.value; // this is the search text
        this.props.doSearch(query);
    },
    render: function(){
        var style={
            marginBotton: '50px'
        };
        return(
            <div className="center container" style={style}> 
            <input type="text" ref="searchInput" placeholder="Search Name" value={this.props.query} onChange={this.doSearch}/>
            </div>
        )
    }
});

var StarredRepoList = React.createClass({
    getInitialState: function(){
        return { data: [],
                 searchQuery: [],
                 tagData: []
                };
    },
    loadReposFromServer: function(){
        $.ajax({
            url: "/api/starred" ,
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
    sendCommentToServer: function(index, repoId, comment){
        var url = "/api/" + repoId + "/comment/";
        var postData = JSON.stringify({comment: comment});
        var data = this.state.data;
        console.log(postData);
        var items = this.state.data;
        items[index].comment = comment;
        this.setState({data: items});
        $.ajax({
            type: "POST",
            url: url,
            data: postData,
            dataType: 'json',
            contentType: 'application/json',
            success: function(postData){
                console.log("success!!!");
            }.bind(this),
            error: function(xhr, status, err){
                console.error("POST REQUEST ERROR>");
            }.bind(this)
        });
    },
    componentDidMount: function(){
        this.loadReposFromServer();
        setInterval(this.loadCommentsFromServer, 8000);
    },
    handleTagInput: function(repoId){
        // var data = this.state.data;
        // $.ajax({
        //     url: "/api/starred" + "/" + repoOwner + "/" + repoName,
        //     dataType: 'json',
        //     type: 'DELETE',
        //     success: function(data){
        //         console.log(repoOwner + "/" + repoName + " unstarred!");
        //         this.setState({data: data});
        //         this.setState({dataTemp: data});
        //     }.bind(this),
        //     error: function(xhr, status, err){
        //         console.error("/api/starred", status, err.toString());
        //     }.bind(this)
        // });
    },
    doSearch: function(query){
        var filter = query.toLowerCase();
        this.setState({searchQuery: filter});
            
    },
    render: function(){
        return (
            <div className="">    
                <h1 className="Head"></h1>
                <SearchBar searchQuery={this.state.searchQuery} doSearch={this.doSearch}/>
                <RepoList  
                onPostCommentRequest={this.sendCommentToServer} 
                data={this.state.data} 
                searchQuery={this.state.searchQuery}
                onTagInput={this.handleTagInput}
                tagData={this.state.tagData}/>
            </div>
        );
    }
});

var RepoList = React.createClass({
    render: function(){
        var filter = this.props.searchQuery;
        var RepoNodes = this.props.data.map(function(repo, index){
            if(repo.name.toLowerCase().indexOf(filter) < 0){
                return;
            }
            return(
                <Repo key={repo.id} id={repo.id} data={repo}
                owner={repo.owner.login}
                name={repo.name} 
                onPostComment={this.props.onPostCommentRequest}
                onPostTags={this.props.onTagInput}
                tagData={this.props.tagData}
                index={index}>
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
    CommentBox: function(){
        var comment = prompt("Please Enter the Comment:");
        if(comment != null){
            this.props.onPostComment(this.props.index, this.props.data.id, comment);
        }   
    },
    render: function(){
        var owner = this.props.data.owner.login;
        var name = this.props.data.name;
        var address = "http://github.com/" + owner + "/" + name;
        var downloadAddress="https://github.com/" + owner + "/" + name + "/archive/master.zip";
        var style = {
            marginTop:'0px'
        };
        return(
            <div className="container first_link">
                <div className="row">
                    <div className="col-md-10 col-xs-10 col-sm-10">
                    <div className="fluid">
                    <a href= {address}>
                        <h3 style={style}>
                        {this.props.data.owner.login} / {this.props.data.name}
                        </h3>
                    </a>
                    <p>{this.props.data.description}</p>
                    </div>
                    </div>
                    <div className="col-md-2 col-xs-2 col-sm-2 ">
                        <div className="unstar">
                            <div className="row">
                            <div className="center">
                            <a className="btn btn-success"  role="button">
                                <span className="glyphicon glyphicon-pencil" onClick={this.CommentBox} aria-hidden="true"></span>
                            </a>
                            <a className="btn btn-success blockBtn" href={downloadAddress} role="button">
                                <span className="glyphicon glyphicon-download-alt" aria-hidden="true"></span>
                            </a>
                            
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <hr/>
                    <div >
                        <strong>Comment: </strong>
                        {this.props.data.comment}
                    </div>
                    <div className="col-md-4 col-sm-4 col-xs-4 unstar">
                            
                    </div>
                
                <div class="py-1">
                    <p class="d-inline-block col-md-9  text-gray pr-4">
                        
                        
                    </p>
                </div>
                <div className="py-1">
                    <TokenField tagData={this.props.tagData} onTagSubmit={this.props.onPostTags}/>
                </div>
                <hr/>
            </div>)
    }
});


var TokenField = React.createClass({
    getInitialState: function(){
        return {
            tags: []
        };
    },
    componentDidMount: function(){
        // $('#tokenfield').tokenfield({});
        $(ReactDOM.findDOMNode(this)).tokenfield({});
        
    },
    handleKeyPress: function(e){
        alert();

        if(e.key === 'Enter'){
            var tag= tag + this.refs.tagInput.value; // this is the search text
            this.props.tagData 
            // this.setState({tagData: tagData + tag}).bind(this);
            // this.props.tagData = this.props.tagData + tag;
            alert(" Tags are:" + tag);
            
            
        }
    },
    render: function(){
        // $('#tokenfield').tokenfield({};)
        
        return(
            <div id="token">

                <p>Helloooo{this.props.tagData}</p>
                {this.state.tags}
                <input type="text" onChange={this.handleKeyPress} id="tokenfield" ref="tagInput"/>
            </div>
        )
    }
})

var User = React.createClass({
    getInitialState : function(){
        return { data: [],
                 lock: false};
    },
    loadReposFromServer: function(){
        $.ajax({
            url: "/api/user" ,
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
        setInterval(this.loadCommentsFromServer, 8000);
    },
    
    render: function(){
        return (
            <div className="">    
                <h1 className="Head"></h1>
                <UserInfo data={this.state.data}/>
            </div>
        );
    }
});

var UserInfo = React.createClass({
    render: function(){
        return(
            <div>
            <UserAvatar data={this.props.data}/>
            <UserName data={this.props.data}/>
            <UserBio data={this.props.data}/>
            </div>
        )
    }
});

var UserAvatar = React.createClass({
    render: function(){
        return(
            <img className="image_test"src={this.props.data.avatar_url}/>
        );
    }
});

var UserName = React.createClass({
    render: function(){
        var login = this.props.data.login;
        var url = "https://github.com/" + login;
        return (
            <div>
            <h1 className="center"><a href={url}>{this.props.data.name}</a></h1>
            <h4 className="center">@{this.props.data.login}</h4>
            </div>
        );
    }
});


var UserBio = React.createClass({
    render: function(){
        return (
            <h3 className="center">{this.props.data.bio}</h3>
        )
    }
});

var contact = React.createClass({
    render: function(){
        var commentStyle = {
            rows: 10,
            cols: 10
        }
        return( 
            <div className="center container">
                <h1></h1>
                <form method=''>
                    <div className="center Head">
                        <input type="text" name="name" placeholder="Name"/>
                    </div>
                    <div className="center Head">
                        <textarea type="textbox"style={commentStyle} placeholder="Enter your comments!"/>
                    </div>
                    <button className="btn btn-lg btn-success" value="submit">Comment!</button>
                </form>
            </div>);
    }
});


ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={NavigationBar}>
            <IndexRoute component={User}/>
            <Route path="/list" component={StarredRepoList}/>
            <Route path="/contact" component={contact}/>
        </Route>
    </Router>,
    document.getElementById('App')
);  