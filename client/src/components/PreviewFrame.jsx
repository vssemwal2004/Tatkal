const PreviewFrame = ({ children }) => (
  <div className="relative w-full fade-rise">
    <img alt="Laptop frame" className="pointer-events-none relative z-10 w-full select-none" src="/frame.webp" />
    <div className="absolute left-[17.85%] right-[16.45%] top-[11.15%] bottom-[16.75%] z-20 overflow-hidden rounded-[1.1vw] bg-[#f8fbff] shadow-[inset_0_0_0_1px_rgba(13,67,97,0.08)]">
      <div className="h-full overflow-hidden bg-[linear-gradient(180deg,#ffffff,#f6faff)]">
        <div className="preview-screen-scroll h-full overflow-x-hidden overflow-y-auto p-2 sm:p-2.5 lg:p-3">
          <div className="preview-screen-stage min-h-full origin-top scale-[0.92] transition-all duration-300 ease-out">{children}</div>
        </div>
      </div>
    </div>
  </div>
);

export default PreviewFrame;
