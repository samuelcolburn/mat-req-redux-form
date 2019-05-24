import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import React, { useContext, useRef } from 'react';
// import { ReactReduxContext } from 'react-redux';
import Uppy from '@uppy/core';
// import uppyReduxStore from '@uppy/store-redux';
import { Dashboard } from '@uppy/react';

// 5 MB in bytes
const MAX_FILE_SIZE = 5 * Math.pow(10, 6);

// const makeUppy = store =>
//   store
//     ? Uppy({
//         restrictions: {
//           maxFileSize: MAX_FILE_SIZE
//         },
//         store: uppyReduxStore({
//           store: store // That's a lot of stores!
//         })
//       })
//     : null;

const uppy = Uppy({
  restrictions: {
    maxFileSize: MAX_FILE_SIZE
  }
});

const AttachmentsField = ({ form }) => {
  // const store = useContext(ReactReduxContext);
  // const uppy = useRef(
  //   Uppy({
  //     restrictions: {
  //       maxFileSize: MAX_FILE_SIZE
  //     },
  //     store: uppyReduxStore({
  //       store: store // That's a lot of stores!
  //     })
  //   })
  // );

  return (
    <Dashboard
      id={form + '_attachments'}
      uppy={uppy}
      note="Max file size: 5MB"
      height={300}
    />
  );
};

export default AttachmentsField;
