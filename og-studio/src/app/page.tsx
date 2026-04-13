import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Nav */}
      <nav className="border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            <span className="font-bold text-lg">OG Studio</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link
              href="/editor"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-medium rounded-lg transition-colors"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
            Open Graph Image Generator
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            Create stunning
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {" "}OG images{" "}
            </span>
            in seconds
          </h1>
          <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
            Drag & drop editor for Open Graph images. Make your links stand out
            on Twitter, Slack, Discord, and everywhere else.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/editor"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-base font-semibold rounded-lg transition-colors"
            >
              Start Creating — Free
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-base font-medium rounded-lg transition-colors border border-neutral-700"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Preview mockup */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="relative">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="text-xs text-neutral-500 ml-2">OG Studio Editor</span>
            </div>
            <div
              className="w-full aspect-[1200/630] rounded-lg"
              style={{
                background: "linear-gradient(to bottom right, #667eea, #764ba2)",
              }}
            >
              <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="text-white/80 text-2xl sm:text-4xl font-bold text-center px-8">
                  Your Next Blog Post
                </div>
                <div className="text-white/50 text-sm sm:text-lg mt-3">
                  Beautiful previews, zero effort
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-3xl -z-10" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Drag & Drop Editor",
              desc: "Add text, shapes, and images. Move and resize them freely on the canvas.",
              icon: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z",
            },
            {
              title: "Ready-made Templates",
              desc: "Start from professionally designed templates and customize them to match your brand.",
              icon: "M4 5a2 2 0 012-2h8l6 6v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z",
            },
            {
              title: "API Access",
              desc: "Generate images programmatically with our simple REST API. Perfect for automation.",
              icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
            },
            {
              title: "Instant Export",
              desc: "Export as PNG in one click. Perfect 1200x630 dimensions for all platforms.",
              icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
            },
            {
              title: "Custom Backgrounds",
              desc: "Solid colors, gradients, or images. Full control over your design's foundation.",
              icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343",
            },
            {
              title: "No Watermarks",
              desc: "Pro plans get clean, watermark-free exports ready for production use.",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={feature.icon} />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-neutral-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-800">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to create?</h2>
          <p className="text-neutral-400 mb-8">
            Start for free. No credit card required.
          </p>
          <Link
            href="/editor"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 text-base font-semibold rounded-lg transition-colors"
          >
            Open the Editor
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
            <span className="text-sm text-neutral-500">OG Studio</span>
          </div>
          <div className="text-sm text-neutral-500">
            Built for creators who care about details.
          </div>
        </div>
      </footer>
    </div>
  );
}
