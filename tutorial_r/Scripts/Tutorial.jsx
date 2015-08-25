var Comment = React.createClass({
  render: function() {
    return (
	  <div className="comment">
	    <h2 className="commentAuthor">
		  {this.props.author}
		</h2>
		{this.props.children}
      </div>
	 );
   }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
	  return (
	    <Comment author={comment.Author}>
		  {comment.Text}
		</Comment>
	  );
	});
    return (
      <div className="commentList">
	    {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  
  handleSubmit: function(e) {
    e.preventDefault();
	var author = this.refs.author.getDOMNode().value.trim();
	var text = this.refs.text.getDOMNode().value.trim();
	if (!text || !author) {
	  return;
	}
	this.refs.author.getDOMNode().value = '';
	this.refs.text.getDOMNode().value = '';
	return;
  },

  render: function() {
    return (
      <form className="commentForm">
        <input type="text" placeholder="Yuor name" />
		<input type="text" placeholder="Put your comment here..." />
		<input type="submit" value="Post" />
      </form>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', this.props.url, true);
    xhr.onload = function() {
      var data = JSON.parse(xhr.responseText);
      this.setState({ data: data });
    }.bind(this);
    xhr.send();
  },
  handleCommentSubmit: function(comment) {
    //TODO: submit to server and refresh the list
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm on CommentSubmit={this.handleCommentsubmit} />
      </div>
    );
  }
});

React.render(
  <CommentBox url="/comments" pollInterval={2000} />,
  document.getElementById('content')
);

