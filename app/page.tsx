import AgentPulse from "@/components/AgentPulse";
import LinkForm from "@/components/LinkForm";
import { Brain, ImageIcon, MessageSquare, Video } from "lucide-react";

const features = [
  {
    title: "AI Analysis",
    description: "Get deep insights into your video content with our advanced AI analysis. Understand viewer engagement and content quality.",
    icon: Brain,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Smart Transcription",
    description: "Get accurate transcriptions of your videos. Perfect for creating subtitles, blog posts, or repurposing content.",
    icon: MessageSquare,
    iconBg: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Thumbnail Generation",
    description: "Generate eye-catching thumbnails using AI. Boost your click-through rates with compelling visuals.",
    icon: ImageIcon,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
]

const steps = [
  {
    title: "1. Connect Your Content",
    description: "Share your YouTube video URL and let your agent get to work.",
    icon: Video
  },
  {
    title: "2. AI Agent Analysis",
    description: "Your AI agent analyses every aspect of your content.",
    icon: Brain
  },
  {
    title: "3. Receive Intelligence",
    description: "Get your actionable insights and strategic recommendations.",
    icon: MessageSquare
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-10 text-center mb-12">
            <AgentPulse size="large" color="blue" />
            <h1 className="text-4xl  md:text-6xl font-bold text-gray-900 mb-6">
              Meet Your Personal{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                AI content Agent
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Transform your content with AI-powered analysis, transcripts, and insights. Get started in seconds.</p>

            {/* Youtube Video Form  */}
            <LinkForm/>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful features for content creators</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 transition-all ease-out duration-300">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.iconBg}`}>
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works  */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Meet your AI agent in 3 simple steps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index)=>{
              const Icon = step.icon
              return (
                <div key={index} className="text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-20 px-4 md:px-0 bg-gradient-to-r from-blue-600 to-blue-400 ">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to meet your AI Agent?</h2>
          <p className="text-xl text-blue-50">Join creators leveraging AI to unlock content insights.</p>
        </div>
      </section>
    </div>
  );
}
