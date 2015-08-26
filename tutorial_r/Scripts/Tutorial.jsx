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
              <div className="list-group-item">
                <div className="list-group-item-heading">
                    <Comment author={comment.Author}>
                        <div className="list-group-item-text">
                          {comment.Text}
                        </div>
                    </Comment>
                </div>
              </div>
          );
        });
        return (
          <div className="list-group">
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
        this.props.onCommentSubmit({Author: author, Text: text});
        this.refs.author.getDOMNode().value = '';
        this.refs.text.getDOMNode().value = '';
        return;
    },
    render: function() {
        return (
		  <form className="commentForm" onSubmit={this.handleSubmit}>
            <div class="input-group input-group-lg">
              <input type="text" className="form-control" placeholder="Your name" ref="author"/>
            </div>
            <div class="input-group input-group-lg">
		      <input type="text" className="form-control" placeholder="Put your comment here..." ref="text"/>
            </div>
            <div class="input-group input-group-lg">
              <button className="btn btn-default" type="submit" value="Post">GO</button>
            </div>
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
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});

        var data = new FormData();
        data.append('Author', comment.Author);
        data.append('Text', comment.Text);

        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = function() {
            this.loadCommentsFromServer();
        }.bind(this);
        xhr.send(data);
    },
    getInitialState: function() {
        return { data: []};
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
                <div className="input-group">
				  <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                </div>
			</div>
		);
    }
});

React.render(
  <CommentBox url="/comments" submitUrl="/comments/new" pollInterval={2000} />,
  document.getElementById('content')
);

