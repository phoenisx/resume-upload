/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import cx from 'classnames';
import Resumable from 'resumablejs';
import css from './App.module.css';

function App() {
  const drop$ = useRef<HTMLDivElement>(null);
  const browse$ = useRef<HTMLAnchorElement>(null);
  const resumable = useRef(new Resumable({
    target: 'http://localhost:4000/api/v1/upload',
    chunkSize: 1*1024*1024,
    simultaneousUploads: 4,
    testChunks: false,
    throttleProgressCallbacks: 2
  } as unknown as any));

  const [state, updateState] = useImmer({
    progressStyle: {
      width: '0',
    },
  });

  const handleDragEnter = () => {

  }
  const handleDragEnd = () => {

  }
  const handleDrop = () => {

  }

  useEffect(() => {
    if (drop$.current && browse$.current) {
      resumable.current.assignDrop(drop$.current);
      resumable.current.assignBrowse(browse$.current, false);

      resumable.current.on('fileAdded', function(file){
        resumable.current.upload();
      });
      resumable.current.on('fileProgress', function(file){
        console.log(">>>> Upload Progress: ", resumable.current.progress());
        // Handle progress for both the file and the overall upload
        updateState(draft => {
          draft.progressStyle.width = `${Math.floor(resumable.current.progress()*100)}%`;
        });
      });
      resumable.current.on('complete', function() {
        console.log(">>>> Upload Complete: ", resumable.current.progress());
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dropContainerClasses = cx(css.resumableDrop, {

  })

  return (
    <div className={css.App}>
      <h3>Demo with async id generation</h3>
      <div
        ref={drop$}
        className={dropContainerClasses}
        onDragEnter={handleDragEnter}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
      >
        Drop video files here to upload
        <br />OR<br />
        <a
          ref={browse$}
          href="#"
        >
          <u>Select from your Computer</u>
        </a>
      </div>

      <div className={css.resumableProgress}>
        <table>
          <tbody>
            <tr>
              <td width="100%">
                <div className={css.progressContainer}>
                  <div
                    className={css.progressBar}
                    style={state.progressStyle}
                  />
                </div>
              </td>
              <td className={css.progressText} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
