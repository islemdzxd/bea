"use client";

import { useState } from "react";

export default function ChatBotWidget() {

  const [open, setOpen] = useState(false);

  return (
    <>
    
      {/* BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        className="
          fixed
          bottom-6
          right-6
          w-16
          h-16
          rounded-full
          bg-blue-700
          text-white
          text-2xl
          shadow-xl
          z-50
        "
      >
        💬
      </button>

      {/* CHAT */}

      {open && (
        <div
          className="
            fixed
            bottom-24
            right-6
            w-[380px]
            h-[550px]
            bg-white
            rounded-3xl
            shadow-2xl
            flex
            flex-col
            overflow-hidden
            z-50
          "
        >

          {/* HEADER */}

          <div className="bg-blue-700 text-white p-4 flex justify-between">

            <div>
              <h2 className="font-bold text-lg">
                BEA Assistant
              </h2>

              <p className="text-sm opacity-80">
                Smart Banking Support
              </p>
            </div>

            <button onClick={() => setOpen(false)}>
              ✕
            </button>

          </div>

          {/* BODY */}

          <div className="flex-1 p-4 overflow-y-auto">

            <div className="bg-gray-100 p-3 rounded-2xl w-fit">
              Hello 👋 Welcome to BEA Banking Assistant.
            </div>

          </div>

          {/* INPUT */}

          <div className="p-4 border-t flex gap-2">

            <input
              type="text"
              placeholder="Ask something..."
              className="
                flex-1
                border
                rounded-xl
                px-4
                py-2
                outline-none
              "
            />

            <button
              className="
                bg-blue-700
                text-white
                px-4
                rounded-xl
              "
            >
              Send
            </button>

          </div>

        </div>
      )}

    </>
  );
}