import { type PostListController } from './types';

let _controller: PostListController | null = null;

export function setController(c: PostListController) {
  _controller = c;
}

export function getController(): PostListController | null {
  return _controller;
}

export function requireController(): PostListController {
  if (!_controller) throw new Error('[post-list] controller not initialized');
  return _controller;
}
