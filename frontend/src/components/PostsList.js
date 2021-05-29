import React, { Component, lazy, Suspense } from 'react';
import axios from 'axios';
const Post = lazy(() => import('./Post'));

const baseURL = process.env.REACT_APP_BASEURL || 'http://localhost:5000';
const renderLoader = () => (
  <div className="spinner-container">
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

class PostsList extends Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      noOfPosts: 5,
    };
  }

  componentDidMount() {
    axios
      .get(`${baseURL}/server/posts/`)
      .then((response) => {
        this.setState({ posts: response.data.reverse() });

        document.querySelector('.spinner-border').style.display = 'none';
      })
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <div className="posts-list">
        <h1 id="title">Latest Posts</h1>

        <div className="spinner-container">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>

        {this.state.posts.slice(0, this.state.noOfPosts).map((currentPost) => (
          <Suspense key={currentPost._id} fallback={renderLoader()}>
            <Post post={currentPost} />
          </Suspense>
        ))}

        {/* To load more posts */}
        {this.state.posts[this.state.noOfPosts] ? (
          <button
            className="btn btn-link"
            onClick={() =>
              this.setState({
                noOfPosts: this.state.noOfPosts + 3,
              })
            }
          >
            Load More Posts...
          </button>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default PostsList;
