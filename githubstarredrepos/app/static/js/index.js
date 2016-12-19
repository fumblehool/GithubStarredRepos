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
                <li><IndexLink to="/">Home</IndexLink></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        )
    }
});


var Home = React.createClass({
    render: function(){
        return (
            <div>
            <h1 className="Head"></h1>
            <div className="jumbotron">
            <p className="lead">Get Started, Simply Login!</p>
                <p>
                
                    <a className="btn btn-lg btn-success" href="/login" role="button">
                        Login
                    </a>
                </p>
            </div>
            </div>
        );
    }
});


var About = React.createClass({
    render: function(){
        return(
            <div>
                <h1 className="Head"></h1>
                <div className="jumbotron">
                <p>
                This is my 6 weeks Industrial training project.
                <br/>
                - Damanpreet( daman.4880@gmail.com )
                </p>
                </div>
            </div>
        )

    }
});


var Contact = React.createClass({
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
            <IndexRoute component={Home}/>
            <Route path="/about" component={About}/>
            <Route path="/contact" component={Contact}/>
        </Route>
    </Router>,
    document.getElementById('App')
);      