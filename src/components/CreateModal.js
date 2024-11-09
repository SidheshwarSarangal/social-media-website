// CreateModal.jsx
/*
import React from 'react';

const CreateModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg w-11/12 md:w-1/2">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Create Post or Reel</h2>
        {/* Content for creating post/reel goes here */}
        <textarea placeholder="Write your caption..." className="w-full h-40 p-2 border rounded mb-4" />
        <button className="bg-green-500 text-white p-2 rounded">Submit</button>
      </div>
    </div>
  );
};

export default CreateModal;
