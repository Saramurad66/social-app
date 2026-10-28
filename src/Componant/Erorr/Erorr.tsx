

export default function Erorr() {
  return (
    <>
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-8 sm:p-12 text-center shadow-2xl">
        {/* Error Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
          <i className="fa-solid fa-circle-exclamation text-6xl text-red-500"></i>
        </div>

       
        <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
          Oops! Error
        </h1>

        <p className="mb-8 text-base leading-7 text-slate-400 sm:text-lg">
          Something went wrong while loading the data.
          Please try again later.
        </p>

      
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-3 rounded-xl bg-red-500 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
        >
          <i className="fa-solid fa-rotate-right"></i>
          Try Again
        </button>
      </div>
    </div>
    </>
  )
}
