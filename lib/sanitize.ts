import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(input: string) {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['h1','h2','h3','p','b','i','strong','em','ul','ol','li','a','code','pre','blockquote','img','br','hr'],
    ALLOWED_ATTR: ['href','target','rel','src','alt']
  });
}
