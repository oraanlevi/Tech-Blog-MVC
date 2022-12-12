const commentFormHandler = async(event) => {
    event.preventDefault();
  
    const comment_text = document.querySelector('input[name="comment-body"]').value.trim();
  
    // const post_id = document.querySelector('input[name="post-body"]').value.trim();
    // window.location.toString().split('/')[
    //   window.location.toString().split('/').length - 1
   const post_id = document.querySelector('.comment-form').getAttribute('data-post-id')

  
    console.log(comment_text, 'comment_text')
     console.log(post_id, 'This comment is loaded');
    // if there is a comment -- preventing from users submitting empty comments 
    // if (comment_text) {
        const response = await fetch('/api/comments', {
          method: 'POST',
          body: JSON.stringify({
            post_id,
            comment_text
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      
        if (response.ok) {
          document.location.reload();
        } else {
          alert(response.statusText);
        }
      }
    // };
  
  document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);