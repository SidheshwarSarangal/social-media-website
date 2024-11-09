import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PostCreation from './PostCreation';
import ReelCreation from './ReelCreation';

const CreateModal = ({ onClose }) => {
  const [createType, setCreateType] = useState(null);
  const createBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createBoxRef.current && !createBoxRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div
        ref={createBoxRef}
        className="bg-white text-black p-6 rounded-lg w-[550px] h-[550px] relative flex flex-col justify-between shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 focus:outline-none"
        >
          <span className="text-2xl text-gray-600 hover:text-red-600">&times;</span>
        </button>

        <div className="flex flex-col items-center justify-center w-full h-full">
          {createType === null ? (
            <div className="text-center w-full flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-6">Choose Creation Type</h2>
              <div className="flex justify-center w-full">
                <button
                  onClick={() => setCreateType('post')}
                  className="mx-2 px-4 py-2 text-lg font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create Post
                </button>
                <button
                  onClick={() => setCreateType('reel')}
                  className="mx-2 px-4 py-2 text-lg font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create Reel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 w-full flex flex-col items-center">
              {createType === 'post' && <PostCreation onBack={() => setCreateType(null)} />}
              {createType === 'reel' && <ReelCreation onBack={() => setCreateType(null)} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default CreateModal;
