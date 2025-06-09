import React from 'react';
import Link from 'next/link';

const articles = [
  {
    title: "Quantum Computing: What It Is, Why We Want It, and How We're Trying to Get It",
    description:
      "Quantum mechanics emerged as a branch of physics in the early 1900s to explain nature on the scale of atoms and led to advances such as transistors, lasers, and magnetic resonance imaging. The idea to merge quantum mechanics and information theory arose in the 1970s but garnered little attention until 1982, when physicist Richard Feynman gave a talk in which he reasoned that computing based on classical logic could not tractably process calculations describing quantum phenomena. Computing based on quantum phenomena configured to simulate other quantum phenomena, however, would not be subject to the same bottlenecks. Although this application eventually became the field of quantum simulation, it didn't spark much research activity at the time.",
    link: "https://www.ncbi.nlm.nih.gov/books/NBK538701/",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&q=80" // Quantum circuits (Unsplash: Milad Fakurian) 
  },
  {
    title: "Quantum Computing for Business Leaders",
    description:
      "Quantum computers can solve problems exponentially faster than classical computers can. They will bring about two huge changes: an end to our current infrastructure for cybersecurity over public networks and an explosion of algorithmic power that holds the...",
    link: "https://hbr.org/2022/01/quantum-computing-for-business-leaders",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Quantum Computing: Current Progress and Future Directions",
    description:
      "The limitations of contemporary supercomputers, as well as the ramifications for academics and institutions worldwide, are drawing attention in the scientific community. For example, researchers may use current technology to perform more complicated simulations, such as those that focus on chemistry and the reactive properties of each element. However, when the intricacy of these interactions increases, they become far more challenging for current supercomputers to manage. Due to the limited processing capability of these devices, finishing these sorts of computations is nearly impossible, which is forcing scientists to choose between speed and precision while doing these studies.",
    link: "https://er.educause.edu/articles/2022/7/quantum-computing-current-progress-and-future-directions",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" // Data/technology grid (Unsplash: Markus Spiske) 
  },
  {
    title: "Transforming Research with Quantum Computing",
    description:
      "Quantum computing is a novel method of computation that uses the principles of quantum mechanics to handle highly challenging situations in a very short amount of time. Quantum technology has the ability to significantly impact worldwide advancement, even prior to the complete deployment of quantum machines. Quantum technology for communication, computation, and sensors has the capacity to revolutionise many industries, and several nations are making investments in this promising field. This includes research investments from both the public and commercial sectors. This article delves into the recent quantum computing advancements and the potential opportunities made possible by quantum technology in the next few decades. We outline a vision and scientific innovation for embracing the quantum age, as well as explore the pioneering applications of quantum computing. We also highlight software tools and platforms for quantum programming to unlock the power of computing and revolutionize the world. Finally, we identify the groundbreaking impacts of quantum computing on next-generation research and discuss the benefits of unleashing its revolutionary capabilities.",
    link: "https://www.sciencedirect.com/science/article/pii/S2949948824000295",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" // Quantum/physics abstract (Unsplash: Hans Reniers) 
  },
  {
    title: "Quantum computers tackle unexplored particle physics",
    description:
      "Subatomic particles such as quarks can pair up when linked by ‘strings’ of force fields — and release energy when these strings are pulled to the point of breaking. Two teams of physicists have now used quantum computers to mimic this phenomenon and watch it unfold in real time. The results, described in two Nature papers on 4 June1,2, are the latest in a series of breakthroughs towards using quantum computers for simulations that are beyond the ability of any ordinary computers",
    link: "https://www.nature.com/articles/d41586-025-01797-3",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "The Race for Quantum Supremacy",
    description:
      "Quantum supremacy refers to the point where quantum computers can solve problems that are infeasible for classical computers. In 2019, Google claimed to achieve this milestone, solving a specific problem in 200 seconds that would take the fastest supercomputer thousands of years. This achievement has sparked global competition and investment in quantum hardware and algorithms, accelerating the journey toward practical quantum applications.",
    link: "https://www.nature.com/articles/d41586-019-03213-z",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
  }
];

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '...' : str;
}

export default function ArticlesPage() {
  return (
      <div className="max-w-5xl mx-auto">
              <div className="flex justify-center w-full">
        <Link href="/" className="mb-6 px-5 py-2 rounded-lg bg-[#232946] text-[#ffd700] font-semibold shadow hover:bg-[#393e46] transition">← Back to Home</Link>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-[#ff7f50] text-center drop-shadow">Quantum Computing Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, idx) => (
          <div
            key={idx}
            className="bg-black/30 rounded-2xl p-6 shadow-lg flex flex-col justify-between items-start h-[480px] max-h-[480px] min-h-[480px]"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-32 object-cover rounded-xl mb-4 border border-[#222] shadow"
              loading="lazy"
            />
            <div className="w-full">
              <h2 className="text-xl font-semibold text-[#7fdbff] mb-3 line-clamp-2 min-h-[60px]">{article.title}</h2>
              <p className="text-gray-200 mb-6 text-base line-clamp-5 min-h-[110px]">
                {truncate(article.description, 270)}
              </p>
            </div>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block px-5 py-2 rounded bg-gradient-to-r from-[#7fdbff] to-[#ff7f50] text-black font-bold shadow hover:scale-105 transition"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
