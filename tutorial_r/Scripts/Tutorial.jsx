﻿var data = [
  { Author: "Daniel Lo Nigro", Text: "Hello ReactJS.NET World!" },
  { Author: "Pete Hunt", Text: "This is one comment" },
  { Author: "Jordan Walke", Text: "This is *another* comment" }
];


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
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentWillmount: function() {
    var xhr = new XMLHttpRequest();
	xhr.open('get',this.props.url,true);
	xhr.onload = function() {
	  var data = JSON.parse(xhr.responseText);
	  this.setState({ data: data });
	}.bind(this);
	xhr.send();
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm />
      </div>
    );
  }
});


React.render(
  <CommentBox data={data} />,
  document.getElementById('content')
);
