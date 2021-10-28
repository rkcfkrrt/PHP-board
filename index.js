/* eslint-disable no-undef, no-useless-escape, no-alert */

const url = 'http://mentor-program.co/mtr04group6/wendyl/week12/api_board/';

function escape(toOutput) {
  return toOutput.replace(/\&/g, '&amp;')
    .replace(/\</g, '&lt;')
    .replace(/\>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/\'/g, '&#x27')
    .replace(/\//g, '&#x2F');
}
// 新增留言
function appendCommentToDOM(container, comment, isPrepend) {
  const html = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${escape(comment.nickname)}</h5>
        <p class="card-text">${escape(comment.content)}</p>
      </div>
    </div>
  `;
  if (isPrepend) {
    container.prepend(html);
  } else {
    container.append(html);
  }
}

$(document).ready(() => {
  // 顯示留言
  const commentsDOM = $('.comments');
  $.ajax({
    url: `${url}api_comments.php?site_key=wendyl`,
  }).done((data) => {
    if (!data.ok) {
      alert(data.message);
      return;
    }

    const comments = data.discussions;
    const page = Math.ceil(comments.length / 5);
    let j = 0;
    // 顯示最新 5 則
    for (let i = 0; i < 5; i += 1) {
      appendCommentToDOM(commentsDOM, comments[i]);
    }
    // 監聽「載入更多」按鈕
    $('.container').on('click', ('.more'), () => {
      // 點擊一次 j + 1，亦即留言數 +5
      j += 1;
      const set = (5 * j);
      for (let n = (0 + set); n < (5 + set); n += 1) {
        // 確認下一輪的 set 是否大於留言數目，若為是，則不顯示「載入更多」按鈕
        if ((j + 1) >= page) {
          $('.more').addClass('hide');
        }
        // 放新增的 5 則到頁面
        if (n >= 0) {
          appendCommentToDOM(commentsDOM, comments[n]);
        }
      }
    });
  });

  // 新增留言
  $('.add-comment-form').submit((e) => {
    e.preventDefault();
    const newCommentData = {
      site_key: 'wendyl',
      nickname: $('input[name=nickname]').val(),
      content: $('textarea[name=content]').val(),
    };
    $.ajax({
      type: 'POST',
      url: `${url}api_add_comments.php`,
      data: newCommentData,
    }).done((data) => {
      if (!data.ok) {
        alert(data.message);
        return;
      }
      $('input[name=nickname]').val('');
      $('textarea[name=content]').val('');
      appendCommentToDOM(commentsDOM, newCommentData, true);
    });
  });
});
