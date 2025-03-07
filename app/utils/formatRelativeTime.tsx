const formatRelativeTime = (date: Date) => {
  const now = new Date();

  const diffInMilliSeconds = now.getTime() - new Date(date).getTime();
  const diffInDays = Math.floor(diffInMilliSeconds / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInDays === 0) {
    return "Posted Today";
  } else if (diffInDays === 1) {
    return "Posted 1 Day ago";
  } else if (diffInDays < 7) {
    return `Posted ${diffInDays} days ago`;
  } else if (diffInWeeks === 1) {
    return "Posted 1 Week ago";
  } else if (diffInWeeks < 4) {
    return `Posted ${diffInWeeks} weeks ago`;
  } else if (diffInMonths === 1) {
    return "Posted 1 Month ago";
  } else {
    return `Posted ${diffInMonths} months ago`;
  }
};

export default formatRelativeTime;
