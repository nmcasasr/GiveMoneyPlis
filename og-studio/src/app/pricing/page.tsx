import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying things out",
    features: [
      "50 images/month",
      "3 templates",
      "PNG export",
      "OG Studio watermark",
    ],
    cta: "Get Started",
    href: "/editor",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For bloggers and indie makers",
    features: [
      "1,000 images/month",
      "All templates",
      "No watermark",
      "API access",
      "Custom fonts",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/editor",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    description: "For teams and high-volume use",
    features: [
      "10,000 images/month",
      "All templates",
      "No watermark",
      "API access",
      "Custom templates",
      "Webhooks",
      "Priority rendering",
      "Dedicated support",
    ],
    cta: "Contact Us",
    href: "/editor",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Nav */}
      <nav className="border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            <span className="font-bold text-lg">OG Studio</span>
          </Link>
          <Link
            href="/editor"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-medium rounded-lg transition-colors"
          >
            Open Editor
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-neutral-400">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-blue-600/10 border-2 border-blue-500 relative"
                  : "bg-neutral-900 border border-neutral-800"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-neutral-400 ml-1">{plan.period}</span>
              </div>
              <p className="text-sm text-neutral-400 mb-6">
                {plan.description}
              </p>
              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-lg font-medium transition-colors mb-8 ${
                  plan.highlighted
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                }`}
              >
                {plan.cta}
              </Link>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-neutral-300"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "What is an OG image?",
                a: "OG (Open Graph) images are the preview images that appear when you share a link on social media, Slack, Discord, etc. They make your content look professional and increase click-through rates.",
              },
              {
                q: "Can I use this for free?",
                a: "Yes! The free plan includes 50 image generations per month with 3 templates. Perfect for personal blogs and small projects.",
              },
              {
                q: "How does the API work?",
                a: "Send a GET request with your title and style parameters, and receive a PNG image back. It's that simple. Available on Pro and Business plans.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. No contracts, no hidden fees. Cancel your subscription at any time from your dashboard.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-neutral-800 pb-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-neutral-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
