import ContentSection from "@/components/ContentSection";
import BioLink from "@/components/BioLink";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto w-full lg:w-1/2">
        {/* Profile Image */}
        <div className="mb-8 w-[30%]">
          <div
            className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-[0_0_18px_3px_rgba(0,136,255,0.15)]"
            style={{
              animation: "breathe 8.7s ease-in-out infinite",
              animationDelay: "-4.2s",
            }}
          >
            <Image
              src="/jason-swim-photo-trimmed.png"
              alt="Jason swimming"
              width={300}
              height={300}
              className="w-full"
              priority
            />
          </div>
        </div>

        {/* Intro Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-display font-bold mb-6 text-foreground tracking-tight">
            Hi, I'm Jason.
          </h1>
          <div className="space-y-4 text-foreground text-base">
            <p>
              I'm currently taking a break to explore and dive deeper into
              research. Previously, I was Founding Engineer at{" "}
              <BioLink href="https://www.sequoiacap.com/article/partnering-with-abby-care-a-caregiving-revolution/">
                AbbyCare
              </BioLink>
              , building an AI healthcare agency starting with low-income
              families. I also cofounded{" "}
              <BioLink href="https://cohere.so">Cohere</BioLink> (YC S20), which
              was{" "}
              <BioLink href="https://techcrunch.com/2023/06/26/as-the-generative-ai-craze-rages-on-fintech-ramp-acquires-ai-powered-customer-support-startup-cohere-io/">
                acquired by Ramp
              </BioLink>
              . At Duke, I studied Computer Science, Math, and PPE (Philosophy,
              Politics, and Economics).
            </p>
            <p>
              Besides working on things I love, I am a big fan of{" "}
              <BioLink href="https://www.ncmasters.org/c/8C9F32E/file/oct11-hawaii.pdf">
                open water swimming
              </BioLink>
              {", "}
              <BioLink href="https://www.citydancesf.com/">dance</BioLink>
              {", and "}
              <BioLink href="https://palelights.com/2022/08/17/chapter-1/">
                web serials
              </BioLink>
              {". "}I am also a major Google Maps stan, so if you need guides to
              any places, you can see mine{" "}
              <BioLink href="https://maps.app.goo.gl/AQVnkPu3f8KbYR1R8">
                here
              </BioLink>
              .
            </p>
            <p>
              You can find me on{" "}
              <BioLink href="https://github.com/jasonhfwang">Github</BioLink>
              {", "}
              <BioLink href="https://linkedin.com/in/jason-hf-wang">
                LinkedIn
              </BioLink>
              {", or through my "}
              <BioLink href="mailto:hi@jasonwa.ng" external={false}>
                email
              </BioLink>
              .
            </p>
          </div>
        </div>

        {/* Dynamic Content Sections */}
        <div className="space-y-8 mt-16">
          <ContentSection
            title="A Thing I've Worked On"
            sectionType="projects"
          />
          <ContentSection
            title="A Thing I Love Doing"
            sectionType="specialities"
          />
          <ContentSection title="A Thought I've Had" sectionType="thoughts" />
        </div>
      </div>
    </main>
  );
}
