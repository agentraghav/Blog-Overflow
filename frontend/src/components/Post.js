import React, { Component, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
import PropTypes from 'prop-types';
const CommentList = lazy(() => import('./CommentList'));

const baseURL = process.env.REACT_APP_BASEURL || 'http://localhost:5000';
const RenderLoader = () => (
  <div className="spinner-container">
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = { post: {}, isLoggedIn: false, readingTime: 0 };

    this.deletePost = this.deletePost.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  componentDidMount() {
    if (!this.props.post) {
      axios
        .get(`${baseURL}/server/posts/${this.props.match.params.id}`)
        .then((response) => {
          this.setState({ post: response.data });
          if (this.state.post) {
            const wordsPerMinute = 200; //average rate;
            const noOfWords = this.state.post.body.split(' ').length;
            if (noOfWords) {
              const readingTime = Math.floor(noOfWords / wordsPerMinute);
              this.setState({ readingTime: readingTime });
            }
          }

          document.querySelector('.spinner-border').style.display = 'none';
          document.querySelector('.post').style.display = 'block';
        })
        .catch((err) => console.error(err));
    }
  }

  componentDidUpdate() {
    if (
      sessionStorage.getItem('isLoggedIn') === 'true' &&
      this.state.post.author === sessionStorage.getItem('username')
    ) {
      this.setState((prevState) => {
        if (!prevState.isLoggedIn) {
          return { isLoggedIn: true };
        }
      });
    }
  }

  confirmDelete(id) {
    confirmAlert({
      title: 'Confirm to delete this post.',
      message: 'Are you sure you want to do this?',
      buttons: [
        {
          label: 'YES',
          onClick: () => this.deletePost(id),
        },
        {
          label: 'NO  ',
          onClick: () =>
            console.log(
              "NO! I don't want to delete this magnificant piece of art!",
            ),
        },
      ],
    });
  }

  deletePost(id) {
    axios
      .delete(`${baseURL}/server/posts/${id}`)
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));

    window.location = '/posts';
  }

  render() {
    if (this.props.post) {
      let date = new Date(this.props.post.date).toDateString();
      let displayMonth = date.substring(4, 10);
      let displayYear = date.substring(10);
      let displayDate = `${displayMonth},${displayYear}`;

      return (
        <div className="card">
          <div className="card-body">
            <Link to={'/posts/' + this.props.post._id}>
              <h1 className="post-title">{this.props.post.title}</h1>
              <h5 style={{ marginTop: '20px' }}>
                <span className="author">{this.props.post.author}</span>
              </h5>

              <div
                style={{ marginTop: '20px' }}
                dangerouslySetInnerHTML={{
                  __html: this.props.post.body.substring(0, 400).trim() + '...',
                }}
              ></div>

              <small>
                <time>
                  <div>
                    <span>Published on </span>
                    {displayDate}
                  </div>
                </time>
              </small>
              <br />
            </Link>
          </div>
        </div>
      );
    } else {
      let date = new Date(this.state.post.date).toDateString();
      let displayMonth = date.substring(4, 10);
      let displayYear = date.substring(10);
      let displayDate = `${displayMonth},${displayYear}`;
      return (
        <div>
          {/* A spinner to indicate loading, until the post is available in state */}
          <div className="spinner-container">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>

          {/* The post component that's hidden from view until the state is updated with the content */}
          <div className="post" style={{ display: 'none' }}>
            <div className="card">
              <div className="card-body">
                <h1 className="post-title">{this.state.post.title}</h1>
                <h3 className="author">{this.state.post.author}</h3>
                <time>
                  <div>
                    <span>Published on </span>
                    {displayDate}
                  </div>

                  <span className="read-time">
                    ~ {this.state.readingTime} min read
                  </span>
                </time>
                <div
                  className="post-body"
                  dangerouslySetInnerHTML={{
                    __html: this.state.post.body,
                  }}
                ></div>
                {/* Display the 'Edit' and 'Delete' buttons only if the correct user is logged in */}
                {this.state.isLoggedIn ? (
                  <span>
                    <Link
                      to={`/posts/${this.state.post._id}/edit`}
                      className="btn btn-outline-primary"
                    >
                      Edit
                    </Link>{' '}
                    <button
                      onClick={() => this.confirmDelete(this.state.post._id)}
                      className="btn btn-outline-danger"
                    >
                      Delete
                    </button>
                  </span>
                ) : (
                  ' '
                )}
              </div>
            </div>
            <Suspense fallback={RenderLoader()}>
              <CommentList post={this.state.post} />
            </Suspense>
          </div>
        </div>
      );
    }
  }
}

Post.propTypes = {
  post: PropTypes.object,
};

export default Post;
