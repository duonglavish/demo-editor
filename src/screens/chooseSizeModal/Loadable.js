/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from '../../utils/loadable';

export const ModalChooseSize = lazyLoad(
  () => import('./index'),
  module => module.ModalChooseSize,
);
