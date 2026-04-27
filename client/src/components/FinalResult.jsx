// FinalResult.jsx
import React, { useState } from 'react'
import { motion } from 'motion/react'
import ReactMarkdown from 'react-markdown'
import MermaidSetup from './MermaidSetup.jsx'
import RechartSetUp from './RechartSetUp.jsx'
import { downloadPdf } from '../services/api.js'

const markDownComponent = {
    h1: ({ children }) => <h1 className='text-2xl font-bold text-indigo-700 mt-6 mb-4 border-b pb-2'>{children}</h1>,
    h2: ({ children }) => <h2 className='text-xl font-bold text-indigo-700 mt-6 mb-4 border-b pb-2'>{children}</h2>,
    h3: ({ children }) => <h3 className='text-lg font-bold text-indigo-700 mt-6 mb-4 border-b pb-2'>{children}</h3>,
    h4: ({ children }) => <h4 className='text-md font-bold text-indigo-700 mt-6 mb-4 border-b pb-2'>{children}</h4>,
    h5: ({ children }) => <h5 className='text-sm font-bold text-indigo-700 mt-6 mb-4 pb-1'>{children}</h5>,
    h6: ({ children }) => <h6 className='text-xs font-bold text-indigo-700 mt-6 mb-4 pb-1'>{children}</h6>,
    p: ({ children }) => <p className='text-sm text-gray-700 mb-4 leading-relaxed'>{children}</p>,
    li: ({ children }) => <li className='text-sm text-gray-700 mb-2'>{children}</li>,
    ul: ({ children }) => <ul className='list-disc ml-6 mb-4 space-y-1'>{children}</ul>,
    ol: ({ children }) => <ol className='list-decimal ml-6 mb-4 space-y-1'>{children}</ol>,
    blockquote: ({ children }) => <blockquote className='border-l-4 border-indigo-200 pl-4 italic text-gray-600 mb-4 font-sans'>{children}</blockquote>,
    code: ({ children }) => <code className='bg-gray-100 rounded text-indigo-600 px-1 py-0.5 font-mono text-sm'>{children}</code>,
    pre: ({ children }) => <pre className='bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4'>{children}</pre>,
    table: ({ children }) => (
        <div className='overflow-x-auto mb-6'>
            <table className='min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg'>{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className='bg-gray-50'>{children}</thead>,
    tbody: ({ children }) => <tbody className='divide-y divide-gray-200'>{children}</tbody>,
    tr: ({ children }) => <tr className='divide-x divide-gray-200'>{children}</tr>,
    td: ({ children }) => <td className='px-4 py-2 text-sm text-gray-700 whitespace-nowrap'>{children}</td>,
    th: ({ children }) => <th className='px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>{children}</th>,
}

function FinalResult({ result }) {
    const [quickRevision, setQuickRevision] = useState(false)

    if (!result || !result.data) return null

    const { notes, revisionPoints, subTopics, questions } = result.data

    const charts = result.data?.charts || result.charts || [];

    // ✅ Fix 1: diagram correctly pulled from all possible locations
    let diagram = result.data?.diagram || result.diagram || result.data?.mermaid || null;
    if (diagram && typeof diagram === 'object' && diagram.data === "") {
        diagram = null; // Don't show diagram section if explicitly empty
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-6 p-6 space-y-8 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.02)]'
        >
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-6'>
                <h2 className='text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                    📘 Generated Exam Notes
                </h2>
                <div className='flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0'>
                    <button
                        onClick={() => setQuickRevision(!quickRevision)}
                        className={`flex items-center justify-center flex-1 md:flex-none gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${quickRevision
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                    >
                        {quickRevision ? "Exit Revision Mode" : "Quick Revision (5 min)"}
                    </button>
                    <button onClick={() => downloadPdf(result.data)} className='flex items-center justify-center flex-1 md:flex-none gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700'>
                        ⬇ Download PDF
                    </button>
                </div>
            </div>

            {/* ✅ Fix 2: Topic Priority — no longer wrapping everything else inside it */}
            {!quickRevision && subTopics && (
                <section>
                    <SectionHeader icon="🎯" title="Topic Priority" color="yellow" />
                    {Object.entries(subTopics).map(([star, topics]) => (
                        <div key={star} className='mb-3 rounded-lg bg-gray-50 border border-gray-200 p-3'>
                            <p className='text-sm font-semibold text-yellow-600 mb-1'>{star} Priority</p>
                            <ul className='list-disc ml-4 text-sm text-gray-700 space-y-1'>
                                {topics.map((topic, index) => (
                                    <li key={index}>{topic}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

            {/* ✅ Fix 3: Diagram section is now a sibling, not nested inside subTopics */}
            {diagram && (
                <section>
                    <SectionHeader icon="📊" title="Diagram" color="cyan" />
                    <MermaidSetup diagram={diagram} />
                    <p className='mt-3 text-xs text-gray-500 italic'>
                        ⬇ If you need this diagram for future reference or revision,
                        you can save it by taking a screenshot.
                    </p>
                </section>
            )}

            {charts.length > 0 && <section>
                <SectionHeader icon="📉" title="Visual Charts" color="indigo" />
                <RechartSetUp charts={charts} />
                <p className='mt-3 text-xs text-gray-500 italic'>⬇ If you need this chart for future reference, save it by taking a screenshot.</p>
            </section>}

            {charts.length === 0 && (
                <p className='text-sm text-gray-400 italic'>📈 Chart are not relevant for this topic.</p>
            )}


            {/* Detailed Notes */}
            {!quickRevision && (
                <section className='notes-content'>
                    <SectionHeader icon="📝" title="Detailed Notes" color="indigo" />
                    <div className='bg-white border border-gray-200 rounded-xl p-6'>
                        <ReactMarkdown components={markDownComponent}>
                            {notes}
                        </ReactMarkdown>
                    </div>
                </section>
            )}

            {/* Quick Revision */}
            {quickRevision && (
                <section className='rounded-xl bg-gradient-to-r from-green-100 to-green-50 border border-green-200 p-6'>
                    <h3 className='font-bold text-green-700 mb-3 text-lg'>⚡ Exam Quick Revision Points</h3>
                    <ul className='list-disc ml-6 space-y-1 text-gray-800'>
                        {revisionPoints.map((p, i) => (
                            <li key={i}>{p}</li>
                        ))}
                    </ul>
                </section>
            )}


            {/* ✅ Fix 4: Questions section is now a proper sibling at the correct level */}
            <section>
                <SectionHeader icon="❓" title="Important Questions" color="rose" />
                <p className='font-medium mb-2'>Short Questions:</p>
                <ul className='list-disc ml-6 mb-4 space-y-1 text-sm text-gray-700'>
                    {questions.short.map((q, i) => (
                        <li key={i}>{q}</li>
                    ))}
                </ul>
                <p className='font-medium mb-2'>Long Questions:</p>
                <ul className='list-disc ml-6 space-y-1 text-sm text-gray-700'>
                    {questions.long.map((q, i) => (
                        <li key={i}>{q}</li>
                    ))}
                </ul>
            </section>

        </motion.div>
    )
}

function SectionHeader({ icon, title, color }) {
    const colors = {
        indigo: "from-indigo-100 to-indigo-50 text-indigo-700",
        purple: "from-purple-100 to-purple-50 text-purple-700",
        pink: "from-pink-100 to-pink-50 text-pink-700",
        blue: "from-blue-100 to-blue-50 text-blue-700",
        green: "from-green-100 to-green-50 text-green-700",
        yellow: "from-yellow-100 to-yellow-50 text-yellow-700",
        orange: "from-orange-100 to-orange-50 text-orange-700",
        red: "from-red-100 to-red-50 text-red-700",
        gray: "from-gray-100 to-gray-50 text-gray-700",
        teal: "from-teal-100 to-teal-50 text-teal-700",
        cyan: "from-cyan-100 to-cyan-50 text-cyan-700",
        lime: "from-lime-100 to-lime-50 text-lime-700",
        emerald: "from-emerald-100 to-emerald-50 text-emerald-700",
        fuchsia: "from-fuchsia-100 to-fuchsia-50 text-fuchsia-700",
        rose: "from-rose-100 to-rose-50 text-rose-700",
        sky: "from-sky-100 to-sky-50 text-sky-700",
        violet: "from-violet-100 to-violet-50 text-violet-700",
        stone: "from-stone-100 to-stone-50 text-stone-700",
        neutral: "from-neutral-100 to-neutral-50 text-neutral-700",
        zinc: "from-zinc-100 to-zinc-50 text-zinc-700",
        slate: "from-slate-100 to-slate-50 text-slate-700",
    }
    return (
        <div className={`mb-4 px-4 py-2 rounded-lg bg-gradient-to-r ${colors[color]} font-semibold flex items-center gap-2`}>
            <span>{icon}</span>
            <span>{title}</span>
        </div>
    )
}

export default FinalResult